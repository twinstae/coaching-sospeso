import { getViteConfig } from 'astro/config';

export default getViteConfig({
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
			headless: true,
			provider: 'playwright'
		},
	},
});