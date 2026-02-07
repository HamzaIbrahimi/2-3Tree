import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-static is required for GitHub Pages
		adapter: adapter({
			fallback: '404.html', // Dependent on your needs, '404.html' is best for SPAs
		}),
		paths: {
			// Replace '2-3Tree' with your repo name if it changes
			base: process.env.NODE_ENV === 'production' ? '/2-3Tree' : '',
		},
	},
};

export default config;
