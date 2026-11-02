// Builds public/sw.js after `next build`: bundles src/app/sw.ts and injects the precache list
// (every /_next/static file, the PWA icons and the app pages), so the app works offline.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { getFileManifestEntries } from "@serwist/build";
import { build } from "esbuild";

// Pages that work without the network; the build id refreshes them on every deploy.
const PAGES = [
  "/",
  "/library",
  "/settings",
  "/about",
  "/terms",
  "/security",
  "/privacy",
  "/~offline",
];
const revision = readFileSync(".next/BUILD_ID", "utf8").trim();

const [statics, icons] = await Promise.all([
  getFileManifestEntries({
    globDirectory: ".next",
    globPatterns: ["static/**/*"],
    globIgnores: [],
    modifyURLPrefix: { "static/": "/_next/static/" },
    // Hashed file names change with their content, no revision needed.
    dontCacheBustURLsMatching: /^\/_next\/static\//,
    // The pdf.js worker is about 1.2 MB.
    maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
  }),
  getFileManifestEntries({
    globDirectory: "public",
    globPatterns: ["icons/*.png"],
    globIgnores: [],
    modifyURLPrefix: { "icons/": "/icons/" },
    maximumFileSizeToCacheInBytes: 1024 * 1024,
    additionalPrecacheEntries: PAGES.map((url) => ({ url, revision })),
  }),
]);

const manifest = [...statics.manifestEntries, ...icons.manifestEntries];
for (const w of [...statics.warnings, ...icons.warnings]) console.warn(`sw: ${w}`);

await build({
  entryPoints: ["src/app/sw.ts"],
  outfile: "public/sw.js",
  bundle: true,
  format: "esm",
  minify: true,
  target: "es2022",
  define: { "self.__SW_MANIFEST": JSON.stringify(manifest) },
  // pnpm can install two copies of serwist (one per browserslist version). Bundling both breaks
  // its `instanceof Strategy` check and silently disables the offline fallback page.
  alias: { serwist: createRequire(import.meta.url).resolve("serwist") },
});

const kib = (statics.size + icons.size) / 1024;
console.log(`sw: ${manifest.length} precache entries (${kib.toFixed(0)} KiB) -> public/sw.js`);
