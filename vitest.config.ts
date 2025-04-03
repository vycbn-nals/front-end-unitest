import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8'
    },
    environment: 'jsdom',
    environmentMatchGlobs: [
      // all tests in tests/dom will run in jsdom
      ['tests/dom/**', 'jsdom'],
      // all tests in tests/ with .edge.test.ts will run in edge-runtime
      ['**\/*.edge.test.ts', 'edge-runtime'],
      // ...
    ]
  }
})