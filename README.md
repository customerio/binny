# binny

Assert that everyone (including CI) are running the same development tools, on the same version. 

# Get started 

Run this command to download the latest macOS M1 binary to the current directory: 

```
curl -L --output binny https://github.com/customerio/binny/releases/download/latest/binny-macos-m1
```
> Note: This command will download a binary file into the current directory you're in. Run this command in the root directory of a project you want to use binny with. 

Deno compiled binaries [cannot be signed](https://github.com/denoland/deno/issues/11154) at this time. Therefore, you have to manually give binny permission to execute on your computer. The first time you will run `./binny` after downloading, you will get an error from macOS blocking the execution. [Follow the instructions](https://support.apple.com/en-ca/guide/mac-help/mh40616/mac) to *Open a Mac app from an unidentified developer* and then run `./binny` again. 

Then, [assuming a configuration file already exists in the project](#configure-the-development-tools-for-a-project), use binny to run CLI tools. For example, if you want to run `swiftlint --strict`, run the command: `./binny swiftlint --strict`.

# Configure the development tools for a project 

Let's say that you're building a Swift project. For this project, you may use tools such as [`swiftlint`](https://github.com/realm/SwiftLint/) to lint the code in the project. It's recommended to make sure that everyone on the team is using the same version of `swiftlint` for the code base. Bonus: If the version of `swiftlint` is version controlled so a specific version is associated with each git commit. 

To set up `binny` for installing and running `swiftlint`, create a file called `binny-tools.yml` in the root of the project (if the file has not already been added). The contents of the file should be as follows:

```yaml
# name - the name of the tool when being called by binny. This can be whatever you want it to be. You could call it `lint` so you could run `./binny lint`, for example. 
- name: swiftlint 
  # version - the hard-coded version of the tool that binny must use. If a new version of swiftlint is released, you must update this version number and push a commit to the code. 
  version: 0.52.4
  # downloadUrl - A URL used by binny to download the tool. Notice the URL is dynamic and gets populated with the version number.
  downloadUrl: https://github.com/realm/SwiftLint/releases/download/{version}/portable_swiftlint.zip
  # pathToBinaryInsideZip - Helps binny find the tool binary/script once binny unzips the tool after downloading. For some tools, this value is simply the name of the tool. For others, the tool may be located inside of a subdirectory within the zip. 
  # Tip: try downloading the zip to your computer using the downloadUrl, unzip it, then see where the binary file is located. 
  pathToBinaryInsideZip: "swiftlint"

# Here is another example of a tool that's configured to be used by binny. You can define multiple tools in this file. 
- name: sourcery
  version: 2.0.3
  downloadUrl: https://github.com/krzysztofzablocki/Sourcery/releases/download/{version}/sourcery-{version}.zip
  # The sourcery binary is located inside of a subdirectory within the zip.
  pathToBinaryInsideZip: "bin/sourcery"
```

> Note: See the comments in the snippet above to understand each of the configuration options.

# Development 

The script `binny.ts` is written in Typescript and run with [Deno](https://deno.com/). You must have Deno installed on your machine to run the script (`brew install deno`). VSCode with the Deno plugin is recommended for development.

The easiest way to test the code you are developing is with the automated test suite. Run `deno test --allow-all` to run all tests. This includes e2e tests that runs as close to the real thing as possible.

If you prefer to run the tool yourself, you can run `deno run --allow-all binny.ts <command>` to run the tool. Example: `deno run --allow-all binny.ts sourcery --version` to run the command `sourcery --version`. Note: you must have `sourcery` defined in `binny-tools.yml` before running this command.


