import {Command} from "commander";
import * as process from "node:process";
import {commands} from "./commands";
import figlet from "figlet"
import chalk from "chalk";
import inquirer from "inquirer";
import {compressService} from "./commands/compress";
import {decompressService} from "./commands/decompress";
import {jokeLoop} from "./commands/joke";

// console.log(process.env)


const program = new Command()

program
    .name(chalk.cyanBright(figlet.textSync("zipsterjs")))
    .description(chalk.bold(chalk.italic("ZipsterJS a cli tool to compress and archive files")))
    .version("1.0.0")
    .action(async () => {
        console.log(chalk.cyanBright(figlet.textSync("zipsterjs")))

        console.log()


        const answer = await inquirer.prompt([
            {
                name: "operation",
                message: "Please select the operation that you want to perform: ",
                type: "list",
                choices: ["File Compress / decompress", "Tell me a joke"],
            },
            {
                name: 'compressDecompress',
                message: "Please select what you want to perform: ",
                type: "list",
                choices: ["Compress", "Decompress"],
                when: (answer) => answer.operation === "File Compress / decompress",
            }
        ]);


        if (answer.operation === "File Compress / decompress") {
            if (answer.compressDecompress === "Compress") {
                await compressService()
            } else {
                await decompressService()
            }

        } else if (answer.operation === "Tell me a joke") {
            await jokeLoop()
        }
    })

commands.forEach((c) => {
    program.addCommand(c)
})

program.parse(process.argv)
