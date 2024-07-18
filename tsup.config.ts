import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/**/*.{ts,js}", "!src/**/*.d.ts"],
	splitting: true,
	skipNodeModulesBundle: true,
	sourcemap: true,
	clean: true,
	dts: true,
	format: ["cjs", "esm", "iife"],
	shims: true,
});
