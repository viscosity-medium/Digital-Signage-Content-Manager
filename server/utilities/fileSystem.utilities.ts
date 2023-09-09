import * as path from "path";
import * as fs from "fs";
import {jsonUtilities} from "./json.utilities";

class FileSystem {

    createAbsolutePathFromProjectRoot(relativePathArray: string[]){

        const projectRoot = process.cwd();
        return path.join(projectRoot, ...relativePathArray);

    }

    createAbsolutePathFromSystemRoot(fullPathArray: string[]){

        return path.join(...fullPathArray);

    };

    writeFile(filePath: string, file: any){

        fs.writeFileSync(filePath, JSON.stringify(file, null, 4));

    };

    clearFoldersRecursively(pathToClear: string){

        const internalItems = fs.readdirSync(pathToClear);

        internalItems.forEach(internalItem => {

            const internalPath = path.join(pathToClear, internalItem);

            if(fs.statSync(internalPath).isDirectory()){
                fileSystem.clearFoldersRecursively(internalPath);
            } else {
                fs.unlinkSync(internalPath);
            }

        });

    };

    createFoldersRecursively(totalPath: string){

        const pathSegmentsArray = totalPath.split(/(?<!:)\\|\//);

        pathSegmentsArray.reduce((accumulator: string, currentSegment: string) => {

            const currentPath = path.join(accumulator, currentSegment);

            if(!fs.existsSync(currentPath)){
                fs.mkdirSync(currentPath);
            }

            return currentPath

        }, "")
    }


    readFileSync(path: string){
        return fs.readFileSync(path);
    }

    writeFileSync(path: string, fileData: string){
        return fs.writeFileSync(path, fileData);
    }

    checkFolderExists(path: string){
        return fs.existsSync(path);
    }

    joinPath(pathArr: string[]){
        return path.join(...pathArr)
    }

    copyFile(src: string, dest: string){
        fs.copyFileSync(src, dest)
    }

    // extra methods

    copyMultipleFilesFromMmsMedia(jsonPathsArray: {[p: string]: string}[]){
        jsonPathsArray.forEach((jsonPath) => {

            Object.entries(jsonPath).forEach(([screenName, filePath]: any) => {
                const fileListArray = jsonUtilities.getActualFilesListFromJson(filePath)

                Object.entries(fileListArray).forEach(([timeOfDay, block]: any) => {

                    block.forEach((blockItem) => {

                        Object.entries(blockItem).forEach(([blockName, blockFileListPaths]: any) => {

                            const blockNameFolderPath = this.createAbsolutePathFromProjectRoot(["mms", "Media", "ENKA", screenName, timeOfDay, blockName]);

                            if(!this.checkFolderExists(blockNameFolderPath)){
                                this.createFoldersRecursively(blockNameFolderPath);
                            } else {
                                this.clearFoldersRecursively(blockNameFolderPath)
                            }

                            blockFileListPaths.forEach((blockFilePath) => {

                                const fileName = blockFilePath.replace(/.*\\/, "");
                                const destinationPath = this.joinPath([blockNameFolderPath, fileName])

                                try{
                                    console.log(blockFilePath);
                                    console.log(destinationPath);
                                    this.copyFile(blockFilePath, destinationPath);
                                } catch (err) {
                                    console.log("Файл не удалось скопировать")
                                }

                            })

                        });

                    })

                })

            })

        })
    }

}

export const fileSystem = new FileSystem()