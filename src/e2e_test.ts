import { assertEquals } from "https://deno.land/std@0.201.0/assert/assert_equals.ts";
import { runTool } from "./runner.ts";

Deno.test("run binny with a real tool, expect it runs command", async () => {
  Deno.removeSync("./tools", { recursive: true }) // remove the tools directory so we can test that binny installs the tool.
  
  const expectedStdout = "2.0.3\n"

  const actualStdout = await runTool("sourcery", ["--version"], "binny-tools.yml")  

  assertEquals(actualStdout, expectedStdout)
})