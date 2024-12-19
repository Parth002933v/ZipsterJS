import * as fs from "node:fs";
import archiver from "archiver";
import path from "node:path";

// const testCases = [
//   `"./mydata/data.text" "./date.docx" "valuesfile.pdf"`,    // Mixed quoted and unquoted
//   `"./mydata/data.text" ./date.docx valuesfile.pdf`,        // Mixed quoted and unquoted with no space around quotes
//   `"./mydata/data.text" " ./date.docx " "valuesfile.pdf "`, // Space inside quotes
//   `" "` , // Single space (empty string after trim)
//   `""`, // Empty string in quotes
//   `"" "./path/with space.txt"`, // Empty quoted string followed by valid path
//   `./path1 ./path2 "./path 3/with space.txt"`, // Unquoted and quoted paths with spaces inside quotes
// ];

type entity = {
    path: string,
    isFile: boolean
}

export const utils = {

    parseFilePaths: (input: string): string[] => {
        input = input.trim();

        if (input === "") {
            return [];
        }

        const regex = /"([^"]*)"|([^"\s]+)/g;

        const result: string[] = [];
        let match: RegExpExecArray | null;

        while ((match = regex.exec(input)) !== null) {
            if (match[1]) {
                result.push(match[1]);
            } else if (match[2]) {
                result.push(match[2]);
            }
        }

        return result;
    },


    getFileNameFromPath: (filePath: string) => {
        // console.log(filePath)
        const split = filePath.split('.');
        // console.log(split[1])
        return split[split.length - 2] + "." + split[split.length - 1]
    },

    getParentDirectoryOrKeep: (filePath: string) => {
        if (path.extname(filePath)) {
            return path.dirname(filePath);
        }
        return filePath;
    },

    getArchiveExtension: (filePath: string): { extension?: archiver.Format, error?: Error } => {
        const fileExtension = path.extname(filePath);


        console.log(path.basename(filePath))
        if (fileExtension === ".zip") {
            return {extension: "zip"}
        } else if (fileExtension === ".tar") {
            return {extension: "tar"}
        } else {
            return {error: Error("Invalid file")}
        }

    },

    validateOutputExtensions: (output: string): { extention?: archiver.Format; error?: Error } => {
        // console.log("===",output,"===")
        const split = output.split(".");
        const last = split[split.length - 1];

        if ((last === "zip") || (last === "tar")) {
            return {extention: last};
        } else {
            return {error: Error("In valid file extention")};
        }
    },


    validateFilePaths: (files: string[]): { entity: entity[], error?: Error } => {

        let entity: entity[] = [];
        let error: Error | undefined = undefined;

        files.map((file, i) => {
            const isExist = fs.lstatSync(file, {throwIfNoEntry: false});
            if (!isExist || !(isExist.isFile() || isExist.isDirectory())) {

                error = Error(file)
                return;
            } else if (isExist.isFile()) {

                entity.push({path: file, isFile: true});
            } else {
                entity.push({path: file, isFile: false});
            }
        })

        return {entity: entity, error: error};
    },

    validatePath: (path: string) => {
        const isExist = fs.lstatSync(path, {throwIfNoEntry: false});
        return !!isExist;
    }

}



