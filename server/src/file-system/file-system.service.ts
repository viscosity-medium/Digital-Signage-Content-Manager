import {Injectable} from '@nestjs/common';
import {ansiColors} from "./ansiColors/ansiColors";
import {PartialAnsiColors} from "./ansiColors/ansiColors.types";
import fs from "fs";
import path from "path";
import process from "process";

@Injectable()
export class FileSystemService {

    consoleColorLog({
        consoleString,
        colorWords
    }: {
        consoleString: string,
        colorWords: PartialAnsiColors
    }){

        let modifiedString = consoleString;

        Object.entries(colorWords).forEach(([ color, wordsArray ]) => {

            modifiedString = wordsArray.reduce((modificationString: string, currentWord: string) => {

            const startSliceIndex = modificationString.indexOf(currentWord);
            const endSliceIndex = startSliceIndex + currentWord.length;

                return [
                    modificationString.slice(0, startSliceIndex),
                    ansiColors[color],
                    modificationString.slice(startSliceIndex, endSliceIndex),
                    ansiColors["white"],
                    modificationString.slice(endSliceIndex)
                ].join("");

            }, modifiedString);

        });

        console.log(modifiedString);

    }

    getFolderAbsolutePath({pathArray}:{pathArray: string[]}){

        const projectRootPath = process.cwd();

        return path.join(projectRootPath, ...pathArray);

    }

    async checkFolderAndCreateFullPath({folderPath}: {folderPath: string}){

        const pathSegments = (() => {

            if(folderPath.match("/")){
                return folderPath.split(/\//);
            } else {
                return folderPath.split(/\\/);
            }

        })();

        await new Promise((resolve)=>{

            pathSegments.reduce((previousValue, currentValue) => {

                const newPath = path.join(...previousValue, currentValue)
                console.log(newPath)
                if( !fs.existsSync(newPath) ){
                    fs.mkdirSync(newPath);
                }

                return ([newPath]);

            },[])

            resolve("");

        });



    }

    getListOfItemsInFolder(folderPath: string){
        return fs.readdirSync(folderPath);
    }

    async removeAllFilesFromFolder({folderPath}: {folderPath: string}){

        try {

            const files = fs.readdirSync(folderPath);
            const deleteFilePromises = files.map(file =>
                fs.unlinkSync(path.join(folderPath, file)),
            );

            await Promise.all(deleteFilePromises);

        } catch (err) {
            console.log(err);
        }
    }

}
