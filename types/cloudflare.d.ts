/// <reference types="@cloudflare/workers-types" />

// Extend @opennextjs/cloudflare's CloudflareEnv with project-specific bindings
declare global {
  interface CloudflareEnv {
    DB: D1Database
  }
}

export {}
