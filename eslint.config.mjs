import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Captured third-party assets for the 1:1 Nordstrom replica. These are
    // verbatim copies of the original page's files, not project source.
    "public/**",
    // Generated verbatim CSS blob for the Nordstrom route. Regenerate with
    // `node scripts/build-nordstrom-css.mjs`; it is data, not lintable source.
    "src/lib/nordstrom/css.ts",
  ]),
]);

export default eslintConfig;
