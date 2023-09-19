import { format as stringFormat } from "https://deno.land/x/format@1.0.1/mod.ts";

// After parsing binny-tools.yml, we get an array of ToolConfig objects with this shape. 
export interface ToolConfig {
  name: string;
  version: string;
  downloadUrl: string;
  pathToBinaryInsideZip: string;
}

// Turn the ToolConfig into a an object with useful properties for the rest of the script.
export class Tool {
  name: string;
  version: string;

  // example: `./tools/sourcery_0.39.2` which is the path to the directory where the tool is installed.
  relativeInstallLocationPath: string;
  downloadZipUrl: string
  // example: `./tools/sourcery_0.39.2/bin/sourcery` which is the full path to the binary to execute 
  commandToExecuteBinary: string 

  constructor(config: ToolConfig) {
    this.name = config.name;
    this.version = config.version;

    // This is the file path where we expect the tool to be installed. Each tool has it's own unique directory within the tools/ directory. It's also important to version the directory so that 
    // the tool can download newer versions if needed. 
    this.relativeInstallLocationPath = `./tools/${this.name}_${this.version}`;
    // downloadUrl has dynamic placeholders inside of it.
    this.downloadZipUrl = stringFormat(config.downloadUrl, this as any)
    this.commandToExecuteBinary = `${this.relativeInstallLocationPath}/${config.pathToBinaryInsideZip}`
  }
}