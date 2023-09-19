import { ToolConfig } from "./types/tool.ts";
import {parse as parseYaml} from "https://deno.land/std@0.201.0/yaml/mod.ts";

export function loadConfig(configFilePath: string): ToolConfig[] {
  return parseYaml(Deno.readTextFileSync(configFilePath)) as ToolConfig[]; // Read binny-tools.yml file which is used to define what tools are used in this project.
}