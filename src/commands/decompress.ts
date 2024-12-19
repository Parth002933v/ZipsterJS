import {Command} from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import {utils} from "../utils/utils";
import unzipper from "unzipper"
import * as fs from "node:fs";
import tar from "tar"

export const decompress = new Command()
    .name("decompress")
    .description("Decompress the archived file")
    .argument("[file]")
    .option("-o, --output [file]", "output file")
    .action(decompressService)

export async function decompressService(file: string = "", options: { output?: string } ={}) {

    const answer = await inquirer.prompt([
        {
            name: "file",
            type: "input",
            message: `Please provide the ${chalk.blueBright("path to the archive")} you want to decompress:`,
            when: () => file === undefined || file === "",

        }, {
            name: "output",
            type: "input",
            message: `Enter the directory ${chalk.blueBright("where")} you want ${chalk.blueBright("to")} extract the files:`,
            when: () => options.output === undefined || options.output === "",
        }
    ]);

    file = file !== undefined ? file : answer.file;
    options.output = options.output ? utils.getParentDirectoryOrKeep(options.output) : utils.getParentDirectoryOrKeep(answer.output);


    const isFilePathValid = utils.validatePath(file)
    if (!isFilePathValid) {
        console.log(chalk.bold(chalk.italic(`
            Error: The following file(s) do not exist:
                - ${file}
            Please check the file paths and try again.
            `)))
        process.exit(1);
    }

    // const isOutputPathValid = utils.validatePath(options.output);
    // if (!isOutputPathValid) {
    //     console.log(chalk.bold(chalk.italic(`
    //     Error : the following output path is not exist:
    //          - ${options.output}
    //     Please check the output path and try again.
    //     `)))
    //     process.exit(1);
    // }

    const {extension: archiveExtension, error} = utils.getArchiveExtension(file)
    if (error) {
        console.log(chalk.bold(chalk.italic(`
            Error : the following archive file path is not valid:
                 - ${file} 
            Please check the file and try again. (is should be .zip or .tar)
            `)))
        process.exit(1);
    }

    if (archiveExtension === "zip") {
        console.log(chalk.yellowBright(chalk.bold(chalk.italic("Extracting files... Please wait..."))))
        fs.createReadStream(file).pipe(unzipper.Extract({path: options.output})).on("error", (erro) => {
            console.log(chalk.redBright(erro.message))
        });
        console.log(chalk.greenBright(`Success! Files extracted to ${options.output}.`));

    } else {

        try {
            console.log(chalk.yellowBright(chalk.bold(chalk.italic("Extracting files... Please wait..."))))
            if (!fs.existsSync(options.output)) {
                fs.mkdirSync(options.output, {recursive: true});
            }
            await tar.x({
                file: file,
                cwd: options.output,
            });

            console.log(chalk.greenBright(`Success! Files extracted to ${options.output}.`));
        } catch (erro) {
            console.log(chalk.redBright(erro))
            process.exit(1)
        }

    }


}