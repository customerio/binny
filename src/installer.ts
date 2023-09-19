import { Tool } from "./types/tool.ts";
import {existsSync as doesFileExist } from "https://deno.land/std@0.201.0/fs/mod.ts";
import { decompress as unzip } from "https://deno.land/x/zip@v1.2.5/mod.ts";

export async function installToolLocally(tool: Tool): Promise<void> {
  Deno.mkdirSync(tool.relativeInstallLocationPath, { recursive: true }); // make the tools directory in case it does not exist. This is where all the tools will be installed

  // Check if we have already installed the tool. 
  if (doesFileExist(tool.commandToExecuteBinary, { isFile: true })) {
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