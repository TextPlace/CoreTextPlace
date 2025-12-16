import { defineBuildConfig } from "obuild/config";

export default defineBuildConfig({
  entries: ["src/mod.ts"],
}) as ReturnType<typeof defineBuildConfig>;
