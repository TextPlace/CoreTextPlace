import { build, emptyDir } from "@deno/dnt";

import denoJson from "../deno.json" with { type: "json" };

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  compilerOptions: {
    lib: ["ES2022"],
  },
  package: {
    // package.json properties
    name: "@textplace/core",
    version: denoJson.version,
    description: "The core logic of TextPlace.",
    license: "MIT",
    repository: {
      type: "git",
      url: "https://github.com/TextPlace/CoreTextPlace",
    },
    bugs: {
      url: "https://github.com/TextPlace/CoreTextPlace/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
