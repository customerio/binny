import { assertEquals } from "https://deno.land/std@0.201.0/assert/assert_equals.ts";
import { runTool } from "./runner.ts";

Deno.test("run binny with a real tool, expect it runs command", async () => {
  try {
    // if directory does not exist, Deno.removeSync throws an error. Use try/catch and ignore error to prevent this. 
    Deno.removeSync("./tools", { recursive: true,  }) // remove the tools directory so we can test that binny installs the tool.
  } catch {
    // ignore error, tools directory already removed
  }
  
  const expectedStdout = "0.52.4\n"

  const actualStdout = await runTool("swiftlint", ["--version"], "binny-tools.yml")  

  assertEquals(actualStdout, expectedStdout)
})

Deno.test("binny should fail if the command that it executes also fails", async () => {
  let didThrowError = false

  // We want binny to successfully run the swiftlint binary, but the swiftlint binary should fail when it executes. 
  try {
    await runTool("swiftlint", ["--typo-to-make-command-fail"], "binny-tools.yml")
  } catch {
    didThrowError = true
  }

  assertEquals(didThrowError, true)
})