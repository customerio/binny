/**
 * This is a script designed to run on a local development machine as well as CI server to install and run CLI tools that are used by this project. 
 * The problem that we need to solve is that iOS/Swift development tools today don't have a good way to install and execute versioned binary tools used for development. 
 * Instead, tools are mostly installed via Homebrew or manually by all developers and CI servers. This then causes the issue of everyone being on a different version of each tool, causing issues when using the tools. 
 * 
 * This tool as the following responsibilities:
 * 1. Defines what tools this project uses and what version of the tool that needs to be used. 
 * 2. Downloads the tool automatically for you if it's not installed already. Or, if the tool is out-of-date, it will download the latest version of the tool.
 * 3. Runs the tool with the correct version.
 * 
 * If you want to update the version of a tool to a newer version, simply update the version number in the toolsUsedInProject array below and push a commit to the repo. Then, all developers and CI servers will automatically download the new version the next time they execute this script.
 * 
 * This script is written in TypeScript and uses Deno as the runtime. In order to execute this script, you need to have Deno installed (brew install deno), or we can compile this script into a binary and run it that way.
 */

import {existsSync as doesFileExist } from "https://deno.land/std@0.201.0/fs/mod.ts";
import { decompress as unzip } from "https://deno.land/x/zip@v1.2.5/mod.ts";
import {parse as parseYaml} from "https://deno.land/std@0.201.0/yaml/mod.ts";
import { ToolConfig, Tool } from "./types/tool.ts";

const nameOfToolToRun = Deno.args[0] // get the name of the tool to run from the command line arguments. Example value: 'swiftlint'
const toolsUsedInProject: ToolConfig[] = parseYaml(Deno.readTextFileSync("binny-tools.yml")) as ToolConfig[]; // Read binny-tools.yml file which is used to define what tools are used in this project.
const tool: Tool = new Tool(toolsUsedInProject.find(tool => tool.name === nameOfToolToRun)!)

await assertToolInstalled()
await runCommand()

async function assertToolInstalled(): Promise<void> {
  Deno.mkdirSync(tool.relativeInstallLocationPath, { recursive: true }); // make the tools directory in case it does not exist. This is where all the tools will be installed

  // Check if we have already installed the tool. 
  if (doesFileExist(tool.relativeInstallLocationPath, { isDirectory: true })) {
    // Tool exists, quit early.
    return
  }

  // Tool does not exist so it must be installed. 
  // Each tool gets downloaded from GitHub as a zip file. We need to download the zip file and then unzip the file into a specific directory. Once it is unzipped, we consider the tool installed. 
  console.log(`${tool.name} is not yet installed or is out-of-date. Installing ${tool.name}, version: ${tool.version}...`)
    
  const downloadedZipFilePath = `/tmp/${tool.name}_${tool.version}.zip`; // We save the tool into the /tmp directory as we do not need it after we unzip the file.   
  
  // download zip file into the /tmp directory
  const response = await fetch(tool.downloadZipUrl); 
  Deno.writeFileSync(downloadedZipFilePath, new Uint8Array(await response.arrayBuffer()));

  // unzip the file into the tools directory. 
  await unzip(downloadedZipFilePath, tool.relativeInstallLocationPath);

  console.log(`Downloaded ${tool.name}, version ${tool.version}`);
}

async function runCommand() {
  const argsToSendToCommand = Deno.args.slice(1); // remove the first argument as it is the name of the tool to run. But we allow passing other args to the command. 

  await new Deno.Command(tool.commandToExecuteBinary, { args: argsToSendToCommand, stdout: "inherit", stderr: "inherit" }).output();
}
