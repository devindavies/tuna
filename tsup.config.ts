import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/**/*.ts"],
	splitting: true,
	skipNodeModulesBundle: true,
	sourcemap: true,
	clean: true,
	dts: true,
	format: ["cjs", "esm", "iife"],
});
