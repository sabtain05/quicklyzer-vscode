const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

/**
 * Copy extension resources to dist/resources.
 */
function copyResources() {
	const sourceDir = path.join(process.cwd(), "resources");
	const destinationDir = path.join(process.cwd(), "dist", "resources");

	fs.mkdirSync(destinationDir, { recursive: true });

	const resources = [
		"quicklyzer.png",
		"favicon.png",
	];

	for (const resource of resources) {
		const source = path.join(sourceDir, resource);
		const destination = path.join(destinationDir, resource);

		if (fs.existsSync(source)) {
			fs.copyFileSync(source, destination);
			console.log(`[resources] copied ${resource}`);
		} else {
			console.warn(`[resources] missing ${resource}`);
		}
	}
}

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: "esbuild-problem-matcher",

	setup(build) {
		build.onStart(() => {
			console.log("[watch] build started");
		});

		build.onEnd((result) => {
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`);
				console.error(
					`    ${location.file}:${location.line}:${location.column}:`
				);
			});

			if (result.errors.length === 0) {
				copyResources();
			}

			console.log("[watch] build finished");
		});
	},
};

async function main() {
	const ctx = await esbuild.context({
		entryPoints: [
			"src/extension.ts"
		],
		bundle: true,
		format: "cjs",
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: "node",
		outfile: "dist/extension.js",
		external: ["vscode"],
		logLevel: "silent",
		plugins: [
			esbuildProblemMatcherPlugin,
		],
	});

	if (watch) {
		await ctx.watch();
	} else {
		await ctx.rebuild();
		await ctx.dispose();
	}
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});