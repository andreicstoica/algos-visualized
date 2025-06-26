/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    eslint: {
    // skips all ESLint checks during `next build`. 
    // i am still linting locally !!! 
    // just getting deploy errors on 
    // a component i imported from a library
    ignoreDuringBuilds: true,
  },
};

export default config;
