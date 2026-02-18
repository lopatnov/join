import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import uglify from "@lopatnov/rollup-plugin-uglify";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

const external = [
  ...Object.keys(pkg.devDependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
];

const input = `src/${pkg.libraryFile}.ts`;
const plugins = [json(), typescript(), resolve(), commonjs()];

export default [
  // CommonJS (.cjs) + ES Module (.esm.mjs)
  {
    input,
    output: [
      { file: "dist/join.cjs", format: "cjs", sourcemap: true },
      { file: "dist/join.esm.mjs", format: "es", sourcemap: true }
    ],
    external,
    plugins
  },
  // UMD — for browsers via <script> tag
  {
    input,
    output: {
      file: "dist/join.umd.js",
      format: "umd",
      name: pkg.umdName,
      sourcemap: true
    },
    external,
    plugins
  },
  // UMD minified
  {
    input,
    output: {
      file: "dist/join.umd.min.js",
      format: "umd",
      name: pkg.umdName,
      sourcemap: true
    },
    external,
    plugins: [...plugins, uglify()]
  }
];
