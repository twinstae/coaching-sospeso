import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	root: './',
	test: {
		setupFiles: './setupTests.ts',
		include: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
		css: true,
		pool: 'vmThreads',
		poolOptions: {
			useAtomics: true
		},
		testTimeout: 3000,
		browser: {
			enabled: true,
			name: 'chromium',
			headless: false,
			provider: 'playwright'
		},
	},
});