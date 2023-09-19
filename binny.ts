// simply runs the tool. 
// File exists to:
// 1. When `deno compile` runs, a binary named `binny` is created.
// 2. Be a small file that simply runs a function. This makes the logic of the tool easier to test.

import { runTool } from "./src/runner.ts";

const nameOfToolToRun = Deno.args[0] // get the name of the tool to run from the command line arguments. Example value: 'swiftlint'

const argsToSendToCommand = Deno.args.slice(1); // remove the first argument as it is the name of the tool to run. But we allow passing other args to the command.  

await runTool(nameOfToolToRun, argsToSendToCommand, 'binny-tools.yml')