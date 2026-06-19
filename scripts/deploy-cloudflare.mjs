import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import { applyEdits, format, modify, parse } from 'jsonc-parser'

const rootDir = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const wranglerConfigPath = path.join(rootDir, 'wrangler.jsonc')
const npmCommand = 'npm'
const npxCommand = 'npx'

function wranglerArgs(args) {
  return ['wrangler', ...args]
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    env: { ...process.env, ...options.env },
    encoding: 'utf8',
    stdio: options.capture ? 'pipe' : 'inherit',
    shell: process.platform === 'win32',
  })

  if (result.status !== 0) {
    const details = options.capture ? `\n${result.stderr || result.stdout}` : ''
    const error = new Error(`Command failed: ${command} ${args.join(' ')}${details}`)
    error.status = result.status
    error.stdout = result.stdout
    error.stderr = result.stderr
    throw error
  }

  return result.stdout
}

function runWrangler(args, options) {
  return run(npxCommand, wranglerArgs(args), options)
}

function readWranglerConfig() {
  const source = readFileSync(wranglerConfigPath, 'utf8')
  const config = parse(source)

  if (!config || typeof config !== 'object') {
    throw new Error('wrangler.jsonc could not be parsed.')
  }

  const databases = Array.isArray(config.d1_databases) ? config.d1_databases : []
  if (databases.length === 0) {
    throw new Error('No d1_databases bindings were found in wrangler.jsonc.')
  }

  return { source, config, databases }
}

export function updateD1DatabaseIds(source, databaseIdsByName) {
  const config = parse(source)
  const databases = Array.isArray(config?.d1_databases) ? config.d1_databases : []

  let edits = []
  databases.forEach((database, index) => {
    const databaseName = database?.database_name
    const databaseId = databaseIdsByName.get(databaseName)

    if (!databaseId) {
      return
    }

    edits = modify(
      source,
      ['d1_databases', index, 'database_id'],
      databaseId,
      {
        formattingOptions: { insertSpaces: true, tabSize: 2 },
        getInsertionIndex: (properties) => {
          const nameIndex = properties.indexOf('database_name')
          return nameIndex === -1 ? properties.length : nameIndex + 1
        },
      },
    )

    source = applyEdits(source, edits)
  })

  return applyEdits(
    source,
    format(source, undefined, { insertSpaces: true, tabSize: 2 }),
  )
}

function authErrorMessage() {
  return [
    'Cloudflare Wrangler is not authenticated.',
    'Run `npx wrangler login` in your terminal, then rerun `npm run deploy`.',
    'For token-based deploys, set `CLOUDFLARE_API_TOKEN` before running this command.',
  ].join(' ')
}

function parseWhoamiOutput(output) {
  if (!output) {
    return null
  }

  try {
    return JSON.parse(output)
  } catch {
    return null
  }
}

export function ensureCloudflareAuth(runWranglerCommand = runWrangler) {
  let authStatus

  try {
    authStatus = parseWhoamiOutput(
      runWranglerCommand(['whoami', '--json'], { capture: true }),
    )
  } catch (error) {
    authStatus = parseWhoamiOutput(error.stdout)

    if (!authStatus) {
      throw new Error(`${authErrorMessage()} Wrangler auth check failed: ${error.message}`)
    }
  }

  if (!authStatus?.loggedIn) {
    throw new Error(authErrorMessage())
  }
}

function listD1Databases() {
  return JSON.parse(runWrangler(['d1', 'list', '--json'], { capture: true }))
}

function findD1ByName(databases, databaseName) {
  return databases.find((database) => database.name === databaseName)
}

function ensureD1Databases(configDatabases) {
  let remoteDatabases = listD1Databases()
  const databaseIdsByName = new Map()

  for (const database of configDatabases) {
    const databaseName = database?.database_name
    const binding = database?.binding

    if (!databaseName || !binding) {
      throw new Error('Each D1 binding in wrangler.jsonc needs binding and database_name.')
    }

    let remoteDatabase = findD1ByName(remoteDatabases, databaseName)

    if (!remoteDatabase) {
      console.log(`Creating D1 database ${databaseName}...`)
      runWrangler(['d1', 'create', databaseName])
      remoteDatabases = listD1Databases()
      remoteDatabase = findD1ByName(remoteDatabases, databaseName)
    }

    const databaseId = remoteDatabase?.uuid || remoteDatabase?.database_id || remoteDatabase?.id
    if (!databaseId) {
      throw new Error(`Could not resolve the Cloudflare D1 database ID for ${databaseName}.`)
    }

    databaseIdsByName.set(databaseName, databaseId)
    console.log(`D1 ${binding} -> ${databaseName} (${databaseId})`)
  }

  return databaseIdsByName
}

function writeUpdatedWranglerConfig(source, databaseIdsByName) {
  const updated = updateD1DatabaseIds(source, databaseIdsByName)
  if (updated !== source) {
    writeFileSync(wranglerConfigPath, updated)
  }
}

function migrationFiles() {
  const migrationsDir = path.join(rootDir, 'migrations')

  if (!existsSync(migrationsDir)) {
    return []
  }

  return readdirSync(migrationsDir)
    .filter((fileName) => fileName.toLowerCase().endsWith('.sql'))
    .sort()
}

function applyDatabaseSetup(configDatabases) {
  const migrations = migrationFiles()
  const schemaPath = path.join(rootDir, 'schema.sql')

  for (const database of configDatabases) {
    const databaseName = database.database_name

    if (migrations.length > 0) {
      console.log(`Applying D1 migrations to ${databaseName}...`)
      runWrangler(['d1', 'migrations', 'apply', databaseName, '--remote'], {
        env: { CI: 'true' },
      })
      continue
    }

    if (existsSync(schemaPath)) {
      console.log(`Applying schema.sql to ${databaseName}...`)
      runWrangler(['d1', 'execute', databaseName, '--file=schema.sql', '--remote', '--yes'])
    }
  }
}

function buildAndDeploy() {
  run(npmCommand, ['run', 'build:cf'])
  runWrangler(['deploy'])
}

export function runCloudflareDeploy(mode = 'redeploy') {
  if (!['deploy', 'redeploy'].includes(mode)) {
    throw new Error('Usage: node scripts/deploy-cloudflare.mjs <deploy|redeploy>')
  }

  ensureCloudflareAuth()

  const { source, databases } = readWranglerConfig()
  const databaseIdsByName = ensureD1Databases(databases)
  writeUpdatedWranglerConfig(source, databaseIdsByName)
  applyDatabaseSetup(databases)
  buildAndDeploy()
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    runCloudflareDeploy(process.argv[2])
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}
