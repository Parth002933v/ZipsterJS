import {Command} from "commander";
import inquirer from "inquirer";
import * as fs from "node:fs";
import * as process from "node:process";
import archiver from "archiver"
import {utils} from "../utils/utils";
// import ora from "ora";
import chalk from "chalk";
import {gzip} from "node:zlib";
import yoctoSpinner from "yocto-spinner";
// import yoctoSpinner from "yocto-spinner";

const compress = new Command("")

    .name("compress")
    .argument("[files...]", "files of file paths")
    .option("-o, --output [output]", "output directory")
    .description("Compress the provided files and archive them")
    .action(compressService);

export default compress;

export async function compressService(files: string[] = [], options: { output?: string } = {}) {

    // console.log("argument", files, options)
    const answer = await inquirer.prompt([
        {
            name: "files",
            type: "input",
            message: "Please provide the files you want to compress (separate with space and under \" \"): ",
            when: () => files.length === 0

        }, {
            name: "output",
            type: "input",
            message: "Enter the desired output archive name (e.g., output.zip): ",
            when: () => options.output === undefined || options.output === "",
        }, {
            name: "outputExtension",
            type: "select",
            choices: ["zip", "tar"],
            message: "Enter the desired output extension : ",
            when: (outut) => (options.output || outut.output).split(".")[1] === undefined,
        }
    ]);

    files = files.length > 0 ? files : utils.parseFilePaths(answer.files);
    options.output = options.output || answer.output;
    options.output = answer.outputExtension ? `${options.output}.${answer.outputExtension}` : options.output;


    // console.log("final", files, options)

    const {extention, error: extentionError} = utils.validateOutputExtensions(options.output!.toString());
    if (extentionError) {
        console.error(`
            Error: Invalid file format. Only .zip and .tar files are supported.
            Please provide a valid archive file (.zip or .tar).
            `)
        process.exit(1);
    }

    const {entity, error} = utils.validateFilePaths(files)
    if (error) {
        console.log(`
            Error: The following file(s) do not exist:
                - ${error.message}
            Please check the file paths and try again.
            `)
        process.exit(1);
    }

    const archive = archiver(extention!, {gzip: true});

    entity.forEach((file) => {
        if (file.isFile) {
            archive.append(fs.createReadStream(file.path), {name: utils.getFileNameFromPath(file.path)});
        } else {
            archive.directory(file.path, false)
        }
    })

    archive.pipe(fs.createWriteStream(options.output!));

    console.log("Compressing files... Please wait...")
    // const spinner = yoctoSpinner({text: "Compressing files... Please wait..."}).start()
    await archive.finalize();
    // spinner.stop()

    console.log(chalk.greenBright(`Success! Files compressed to ${options.output}`));
}