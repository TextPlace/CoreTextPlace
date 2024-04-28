import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "@textplace/core",
    version: Deno.args[0],
    description: "The core logic of TextPlace.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/textplace/CoreTextPlace.git",
    },
    bugs: {
      url: "https://github.com/textplace/CoreTextPlace/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
