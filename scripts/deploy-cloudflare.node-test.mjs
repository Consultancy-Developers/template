import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import { updateD1DatabaseIds } from './deploy-cloudflare.mjs'

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
