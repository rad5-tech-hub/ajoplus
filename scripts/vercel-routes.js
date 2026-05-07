import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Vercel Route Helper Utility
 *
 * Generates vercel.json configuration to prevent 404 errors in SPAs deployed on Vercel.
 * Handles client-side routing by rewriting all non-API/static routes to index.html.
 *
 * Usage:
 *   npm run generate-vercel
 *   # or
 *   node scripts/vercel-routes.js
 *
 * This will create/update vercel.json in the project root.
 *
 * Customization:
 *   Edit the config object in the CLI section below to add custom routes, redirects, etc.
 *
 * Example for a typical project:
 *   - Public routes: /, /about, /contact
 *   - Protected routes: /dashboard/*, /admin/*
 *   - API routes: /api/*
 *   - Static assets: /assets/*, /favicon.ico
 *
 * The catch-all rewrite ensures React Router handles all client-side navigation.
 */
function generateVercelConfig(options = {}) {
	const {
		apiRoutes = ['/api/(.*)'],
		staticRoutes = ['/assets/(.*)', '/favicon.ico', '/robots.txt'],
		redirects = [],
		trailingSlash = false,
		cleanUrls = true,
	} = options;

	const rewrites = [];
	const finalRedirects = [...redirects];

	// API routes: preserve as-is (no rewrite)
	apiRoutes.forEach(route => {
		rewrites.push({
			source: route,
			destination: route,
		});
	});

	// Static routes: preserve as-is
	staticRoutes.forEach(route => {
		rewrites.push({
			source: route,
			destination: route,
		});
	});

	// Catch-all rewrite for SPA (React Router handles client-side routing)
	rewrites.push({
		source: '/(.*)',
		destination: '/index.html',
	});

	// Handle trailing slashes
	if (trailingSlash) {
		finalRedirects.push({
			source: '/:path+/',
			destination: '/:path+',
			statusCode: 301,
		});
	}

	const config = {
		rewrites,
		redirects: finalRedirects,
	};

	if (cleanUrls) {
		config.cleanUrls = true;
	}

	return config;
}

// CLI: Generate vercel.json when run directly
if (process.argv[1] && process.argv[1].endsWith('vercel-routes.js')) {
	// Default configuration for AjoPlus project
	const config = generateVercelConfig({
		apiRoutes: ['/api/(.*)'],
		staticRoutes: ['/assets/(.*)', '/favicon.ico', '/robots.txt', '/manifest.json'],
		trailingSlash: false, // React Router handles this
		cleanUrls: true,
		redirects: [
			// Example: redirect old routes if needed
			// { source: '/old-path', destination: '/new-path', statusCode: 301 }
		],
	});

	const outputPath = path.join(__dirname, '..', 'vercel.json');
	fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
	console.log('✅ Generated vercel.json at', outputPath);
	console.log('📝 Configuration:', JSON.stringify(config, null, 2));
}

export { generateVercelConfig };