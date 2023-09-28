import { assertObjectMatch } from "https://deno.land/std@0.201.0/assert/mod.ts";
import { Tool } from "./tool.ts";

Deno.test("Tool, expect constructor to populate properties with expected values", () => {
  const expected: Tool = {
    name: "swiftlint",
    version: "0.39.2",
    relativeInstallLocationPath: "./tools/swiftlint_0.39.2",
    downloadZipUrl: "https://github.com/krzysztofzablocki/Sourcery/releases/download/0.39.2/sourcery-0.39.2.zip",
    commandToExecuteBinary: "./tools/swiftlint_0.39.2/bin/swiftlint",
  }

  const actual: Tool = new Tool({
    name: "swiftlint",
    version: "0.39.2",
    downloadUrl: "https://github.com/krzysztofzablocki/Sourcery/releases/download/{version}/sourcery-{version}.zip",
    pathToBinaryInsideZip: "bin/swiftlint",
  })
  
  assertObjectMatch(actual, expected as any);
});