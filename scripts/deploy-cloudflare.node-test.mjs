import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import { ensureCloudflareAuth, updateD1DatabaseIds } from './deploy-cloudflare.mjs'

describe('updateD1DatabaseIds', () => {
  test('updates matching D1 database ids while preserving JSONC comments', () => {
    const source = `{
  "name": "templates",
  // keep this comment
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "templates-db",
      "database_id": "REPLACE_WITH_YOUR_D1_ID"
    }
  ]
}`

    const updated = updateD1DatabaseIds(source, new Map([['templates-db', 'abc-123']]))

    assert.match(updated, /\/\/ keep this comment/)
    assert.match(updated, /"database_id": "abc-123"/)
    assert.doesNotMatch(updated, /REPLACE_WITH_YOUR_D1_ID/)
  })
})

describe('ensureCloudflareAuth', () => {
  test('checks existing Wrangler auth without forcing browser login', () => {
    const calls = []

    ensureCloudflareAuth((args, options) => {
      calls.push({ args, options })
      assert.deepEqual(args, ['whoami', '--json'])
      assert.equal(options.capture, true)
      return JSON.stringify({ loggedIn: true })
    })

    assert.deepEqual(calls.map((call) => call.args), [['whoami', '--json']])
  })

  test('prints a useful manual auth instruction when Wrangler is not logged in', () => {
    assert.throws(
      () => ensureCloudflareAuth(() => JSON.stringify({ loggedIn: false })),
      /Run `npx wrangler login`/,
    )
  })

  test('prints a useful manual auth instruction when Wrangler auth check fails', () => {
    assert.throws(
      () => ensureCloudflareAuth(() => {
        throw new Error('wrangler whoami failed')
      }),
      /Run `npx wrangler login`/,
    )
  })
})
