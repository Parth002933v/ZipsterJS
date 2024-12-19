import {Command} from "commander";
import {jokeService} from "../service/jokeService";
import chalk from "chalk";
import inquirer from "inquirer";

export const jokeCommands = new Command()
    .name("joke")
    .description("Get the joke")
    .action(joke)

export async function joke() {

    const joke = await jokeService.getJoke()

    console.log()
    console.log(chalk.bold.italic.yellowBright(`Setup : ${joke.setup}`))
    console.log(chalk.bold.italic.cyanBright(`delivery : ${joke.delivery}`))


}

export async function jokeLoop() {
    let keepGoing = true;
    while (keepGoing) {
        await joke();
        console.log()
        const {another} = await inquirer.prompt([
            {
                name: 'another',
                message: 'Want to hear another? (y: yes, n: no)',
                type: 'input',
            },
        ]);

        if (another.toLowerCase() !== 'y') {
            console.log('No more jokes! Have a great day!');
            keepGoing = false;
        }
    }
}