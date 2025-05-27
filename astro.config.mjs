// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: "https://harpiats.github.io",
	integrations: [starlight({
		title: 'Harpia',
		logo: {
			dark: './src/assets/logo-dark.svg',
			light: './src/assets/logo-light.svg',
			replacesTitle: true,
		},
		social: [
			{ icon: 'github', label: 'GitHub', href: 'https://github.com/harpiats' },
		],
		components: {
    	// Override the default `LanguageSelect` component.
    	LanguageSelect: './src/components/VersionBadge.astro',
	  },
		sidebar: [
			{ label: 'Version', link: '/version' },
			{
				label: 'Guides',
				items: [
					{ label: 'Introduction', slug: 'guides/introduction' },
					{ label: 'Installation', slug: 'guides/installation' },
					{ label: 'Project Structure', slug: 'guides/project-structure' },
					{ label: 'Environment Variables', slug: 'guides/environment-variables' },
					{ label: 'Database', slug: 'guides/database' },
					{ label: 'Commands and Scaffold', slug: 'guides/commands-and-scaffold' },
					{ label: 'Module', slug: 'guides/modules' },
					{ label: 'Seeding', slug: 'guides/seeding' },
					{ label: 'Factory', slug: 'guides/factory' },
					{ label: 'Tests', slug: 'guides/test' },
					{ label: 'Observers', slug: 'guides/observers' },
					{ label: 'Mailer', slug: 'guides/mailer' },
					{ label: 'Tasks and Jobs', slug: 'guides/tasks-and-jobs' },
					{ label: 'Utilities', slug: 'guides/utilities' },
					{ label: 'S3', slug: 'guides/s3' },
					{ label: 'Homepage', slug: 'guides/homepage' },
					{ label: 'Authentication', slug: 'guides/authentication' },
				],
			},
			{
				label: 'Core',
				items: [
					{ label: 'Introduction', slug: 'core/introduction' },
					{ label: 'Installation', slug: 'core/installation' },
					{ label: 'Router', slug: 'core/router' },
					{ label: 'Request', slug: 'core/request' },
					{ label: 'Response', slug: 'core/response' },
					{ label: 'Middleware', slug: 'core/middleware' },
					{ label: 'Cookies', slug: 'core/cookies' },
					{ label: 'Cache', slug: 'core/cache' },
					{ label: 'Session', slug: 'core/session' },
					{ label: 'Memory Storage', slug: 'core/memory-storage' },
					{ label: 'Static Files', slug: 'core/static-files' },
					{ label: 'Cors', slug: 'core/cors' },
					{ label: 'Shield', slug: 'core/shield' },
					{ label: 'Template Engine', slug: 'core/template-engine' },
					{ label: 'Test Client', slug: 'core/test-client' },
					{ label: 'Monitor', slug: 'core/monitor' },
					{ label: 'Upload', slug: 'core/upload' },
					{ label: 'Web Sockets', slug: 'core/web-socket' },
				],
			},
			{ label: 'Deploy', link: '/deploy' },
			{ label: 'Development Roadmap', link: '/roadmap' },
		],
	}), sitemap()],
});