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

const plugins = [json(), typescript(), resolve(), commonjs()];

export default [
  {
    input: `src/${pkg.libraryFile}.ts`,
    output: [
      { file: pkg.main, format: "umd", name: pkg.umdName, sourcemap: true },
      { file: pkg.module, format: "es", sourcemap: true }
    ],
    external,
    plugins
  },
  {
    input: `src/${pkg.libraryFile}.ts`,
    output: {
      file: `dist/${pkg.libraryFile}.min.js`,
      name: pkg.umdName,
      format: "umd",
      sourcemap: true
    },
    external,
    plugins: [...plugins, uglify()]
  }
];
