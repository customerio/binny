import { Tool } from "./types/tool.ts";
import { installToolLocally } from "./installer.ts"
import { loadConfig} from "./config_parser.ts"

export async function runTool(nameOfToolToRun: string, commandArgsForToolToRun: string[], configFilePath: string): Promise<string> {
  const toolsUsedInProject = loadConfig(configFilePath)
  const configForToolToRun = toolsUsedInProject.find(tool => tool.name === nameOfToolToRun)
  if (!configForToolToRun) {
    console.error(`Could not find tool named ${nameOfToolToRun} in binny-tools.yml`)
    Deno.exit(1)
  }

  const tool: Tool = new Tool(configForToolToRun)

  await installToolLocally(tool)

  const runningCommandStdout = await runCommand(tool, commandArgsForToolToRun)

  return runningCommandStdout
}

async function runCommand(tool: Tool, commandArgsForToolToRun: string[]): Promise<string> {
  // piping the stdout to allow us to capture it into a variable that we then return from the function. 
  const { code, stdout } = await new Deno.Command(tool.commandToExecuteBinary, { args: commandArgsForToolToRun, stdout: "piped", stderr: "inherit" }).output();

  const outputString = new TextDecoder().decode(stdout); // convert the output from a Uint8Array to a string.
  console.log(outputString) // print the output to the console so the user can see it.

  if (code !== 0) { // if a bash command exits with a non-zero exit code, it means that it failed to run successfully.
    console.error(`Running command: ${tool.commandToExecuteBinary} ${commandArgsForToolToRun}, failed executing with exit code ${code}.`)
    Deno.exit(1) // binny should fail if the command that it runs also fails to match the behavior that the user expects.
  }

  return outputString
}
