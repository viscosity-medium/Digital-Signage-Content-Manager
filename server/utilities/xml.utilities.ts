import xml2js from "xml2js";
import {fileSystem} from "./fileSystem.utilities";
import {CreateXmlSchedule} from "../types/recursiveCycle.types";
import {folderMultiItem} from "../xml/_xml_elements/folderMultiItem";
import path from "path";
import {calculateActiveDays} from "./converter";
import {videoItem} from "../xml/_xml_elements/videoItem";
import {pictureItem} from "../xml/_xml_elements/pictureItem";
import {regExpConditionToDeleteIntermediateFoldersOnPath} from "../system/environmental";


const regExpShortCondition = /^\s*<(?!\/*(TMultiItem|Items|TMovieItem|FileName|easescreen.*|Comment)).*>*.*(\n|\r)/;

class XmlUtilities {

    parseXmlToJson = (xmlString: string) => {

        const parser = new xml2js.Parser();
        let res: Object;

        parser.parseString(xmlString, (err, result) => {
            if(err){
                console.log(`Xml parse error ${err}`)
            } else {
                res = result
            }
        });

        return res

    }

    createMultipleJsonFilesFromXmlAndReturnJsonPathsInArray = (foldersNames: string[]) => {

        return foldersNames.map((folderName)=>{

            const xmlPath = fileSystem.createAbsolutePathFromProjectRoot(["xml", folderName, "0_0_0.xml"]);
            const jsonPath = fileSystem.createAbsolutePathFromProjectRoot(["xml", folderName, "0_0_0.json"]);
            const xmlData = fileSystem.readFileSync(xmlPath).toString();
            const jsonData = xmlUtilities.parseXmlToJson(xmlData);

            fileSystem.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 4));

            return {
                [folderName]: jsonPath
            };

        });

    }

    concatenateTransferredStrings = (content: string) => {
        return content.replace(/' \+(\n|\r)\s*'/, "")
    }

    underlineCodeToSymbol = (content: string) => {
        return content.replace(/&#95;/, "_");
    }

    createXmlSchedule: CreateXmlSchedule = ({
        schedule,
        folderWithContentPath
    }) => {

        return schedule.reduce((accumulator, currentItem) => {

            if(currentItem.type === "folder"){

                return (`${
                    accumulator
                }${
                    folderMultiItem(
                        this.createXmlSchedule({
                            schedule: currentItem.content,
                            folderWithContentPath: fileSystem.joinPath([folderWithContentPath, currentItem.name])
                        })
                    )
                }`);

            } else {

                const fullFilePath = path.join(folderWithContentPath, currentItem.name);
                const relativeMmsMediaPoolFilePath = fullFilePath
                    .replace(/C:\\mms\\Media\\/gm, "")
                    .replace(regExpConditionToDeleteIntermediateFoldersOnPath, "")
                    .replace(/_/gm, "&#95;");

                const dateLimits = calculateActiveDays({
                    minDay: currentItem.limits.date.start,
                    maxDay: currentItem.limits.date.end
                });

                if(currentItem.mimeType?.match("video")){

                    return (`${
                        accumulator
                    }${
                        videoItem({
                            relativeMmsMediaPoolFilePath,
                            dateLimits,
                            fileDuration: currentItem.limits.time
                        })
                    }`);

                } else if(currentItem.mimeType?.match("image")) {
                    return (`${
                        accumulator
                    }${
                        pictureItem({
                            relativeMmsMediaPoolFilePath,
                            dateLimits,
                            fileDuration: currentItem.limits.time
                        })
                    }`)
                } else {
                    return (`${accumulator}`);
                }

            }

        }, "")

    }

}
export const xmlUtilities = new XmlUtilities;