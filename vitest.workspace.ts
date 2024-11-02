// vitest.workspace.ts
import { getViteConfig } from 'astro/config'
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  getViteConfig({
    test: {
      pool: 'vmThreads',
      poolOptions: {
        useAtomics: true
      },
      setupFiles: './setupTests.ts',
      include: [
        'src/components/**/*.test.{ts,tsx}',
        'src/shared/**/*.test.{ts,tsx}',
        'src/routing/**/*.test.{ts,tsx}',
      ],
      name: 'browser',
      css: true,
      browser: {
        enabled: true,
        name: 'chromium',
        headless: true,
        provider: 'playwright'
      },
    },
  }),
  getViteConfig({
    test: {
      include: [
        'src/actions/**/*.test.ts',
        'src/sospeso/**/*.test.ts',
      ],
      name: 'unit',
      environment: 'node',
    },
  }),
])