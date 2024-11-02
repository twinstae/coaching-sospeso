import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    test: {
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
  },
  {
    extends: './vitest.config.ts',
    test: {
      pool: 'vmThreads',
      poolOptions: {
        useAtomics: true
      },
      include: [
        'src/actions/**/*.test.ts',
        'src/sospeso/**/*.test.ts',
        'src/*.test.ts',
      ],
      name: 'unit',
      environment: 'node',
    },
  },
])