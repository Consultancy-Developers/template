import type { NextConfig } from 'next'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

// Wire up D1/KV bindings when running `next dev` locally
void initOpenNextCloudflareForDev()

const nextConfig: NextConfig = {}

export default nextConfig
