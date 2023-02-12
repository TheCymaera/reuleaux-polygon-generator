import typescript from "@rollup/plugin-typescript";
import node from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import scss from "rollup-plugin-import-css";
import { string } from "rollup-plugin-string";

export default [
	{
		input: 'src/main.ts',
		output: {
			// sourcemap: true,
			format: "es",
			file: "./public/dst/main.js",
			assetFileNames: "[name][extname]",
		},
		plugins: [
			node(),
			typescript(),
			scss({
				output: 'main.css',
			}),
			string({
				include: "**/*.html",
			}),
			terser(),
		]
	}
];