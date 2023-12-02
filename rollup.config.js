import typescript from "@rollup/plugin-typescript";

/**
 * @type {import('rollup').RollupOptions}
 */
const configuration = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.mjs",
      format: "es",
      exports: "named",
    },
    {
      file: "dist/index.cjs",
      format: "cjs",
      exports: "named",
    },
  ],
  plugins: [typescript()],
};

export default configuration;
