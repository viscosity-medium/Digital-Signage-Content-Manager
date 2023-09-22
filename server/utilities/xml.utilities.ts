import xml2js from "xml2js";
import {fileSystem} from "./fileSystem.utilities";
import {CreateMultipleXmlSchedules, CreateXmlSchedule} from "../types/recursiveCycle.types";
import {folderMultiItem} from "../xml/_xml_elements/folderMultiItem";
import path from "path";
import {calculateActiveDays} from "./converter";
import {videoItem} from "../xml/_xml_elements/videoItem";
import {pictureItem} from "../xml/_xml_elements/pictureItem";
import {regExpConditionToDeleteIntermediateFoldersOnPath} from "../system/environmental";
import {ScheduleStructure} from "../types/scheduleStucture.types";
import {StaticFolders} from "../types/xml.types";
import {createXmlContent} from "../xml/_xml_elements/xmlBase";
import xmlFormat from "xml-formatter";
import {getSeparatedScreenSchedules} from "./recursiveCycle.utilities";


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

    createMultipleXmlSchedules: CreateMultipleXmlSchedules = ({
        YabloneviyDaySchedule,
        YabloneviyNightSchedule,
        UglovoiDaySchedule,
        UglovoiNightSchedule
    }) => {

        return {
            YabloneviyDaySchedule: this.createXmlSchedule({
                schedule: YabloneviyDaySchedule.schedule,
                folderWithContentPath: YabloneviyDaySchedule.folderWithContentPath
            }),
            YabloneviyNightSchedule: this.createXmlSchedule({
                schedule: YabloneviyNightSchedule.schedule,
                folderWithContentPath: YabloneviyNightSchedule.folderWithContentPath
            }),
            UglovoiDaySchedule: this.createXmlSchedule({
                schedule: UglovoiDaySchedule.schedule,
                folderWithContentPath: UglovoiDaySchedule.folderWithContentPath
            }),
            UglovoiNightSchedule: this.createXmlSchedule({
                schedule: UglovoiNightSchedule.schedule,
                folderWithContentPath: UglovoiNightSchedule.folderWithContentPath
            })
        };

    }

    formSeparatedXmlFiles = ({schedule}: { schedule: ScheduleStructure }): {
        YabloneviyXmlSchedule: string,
        UglovoiXmlSchedule: string
    } => {

        const {
            Yabloneviy,
            Uglovoi
        } = getSeparatedScreenSchedules(schedule);

        const yabloneviyDayFolderPath = fileSystem.joinPath([process.env.EASESCREEN_MMS_MEDIA_FOLDER, "yabloneviy", "day"]);
        const yabloneviyNightFolderPath = fileSystem.joinPath([process.env.EASESCREEN_MMS_MEDIA_FOLDER, "yabloneviy", "night"]);
        const uglovoyDayFolderPath = fileSystem.joinPath([process.env.EASESCREEN_MMS_MEDIA_FOLDER, "uglovoi", "day"]);
        const uglovoyNightFolderPath = fileSystem.joinPath([process.env.EASESCREEN_MMS_MEDIA_FOLDER, "uglovoi", "night"]);

        const {
            YabloneviyDaySchedule,
            YabloneviyNightSchedule,
            UglovoiDaySchedule,
            UglovoiNightSchedule
        } = xmlUtilities.createMultipleXmlSchedules({
            YabloneviyDaySchedule: {
                schedule: Yabloneviy[StaticFolders.Day].content,
                folderWithContentPath: yabloneviyDayFolderPath
            },
            YabloneviyNightSchedule: {
                schedule: Yabloneviy[StaticFolders.Night].content,
                folderWithContentPath: yabloneviyNightFolderPath
            },
            UglovoiDaySchedule: {
                schedule: Uglovoi[StaticFolders.Day].content,
                folderWithContentPath: uglovoyDayFolderPath
            },
            UglovoiNightSchedule: {
                schedule: Uglovoi[StaticFolders.Night].content,
                folderWithContentPath: uglovoyNightFolderPath
            }
        });

        const YabloneviyXmlSchedule = createXmlContent(YabloneviyDaySchedule, YabloneviyNightSchedule);
        const UglovoiXmlSchedule = createXmlContent(UglovoiDaySchedule, UglovoiNightSchedule);

        return {
            YabloneviyXmlSchedule,
            UglovoiXmlSchedule
        }

        // await ftpUtilities.uploadMultipleXmlFilesToMms([
        //     {
        //         playerId: "{318A5E69-E22C-4141-95F5-DBF77E176ABF}",
        //         fileSystemPath: YabloneviyXmlPath
        //     }
        // ])

    }

    writeXmlFilesToFileSystem({
        YabloneviyXmlSchedule,
        UglovoiXmlSchedule
    }:{
        YabloneviyXmlSchedule: string,
        UglovoiXmlSchedule: string
    }): void {

        const YabloneviyFolderPath = fileSystem.createAbsolutePathFromProjectRoot(["xml", "yabloneviy"]);
        const UglovoiFolderPath = fileSystem.createAbsolutePathFromProjectRoot(["xml", "uglovoi"]);
        const YabloneviyXmlPath = fileSystem.createAbsolutePathFromProjectRoot(["xml", "yabloneviy", "0_0_0.xml"]);
        const UglovoiXmlPath = fileSystem.createAbsolutePathFromProjectRoot(["xml", "uglovoi", "0_0_0.xml"]);

        const YabloneviyXmlFormattedSchedule = xmlFormat(YabloneviyXmlSchedule);
        const UglovoiXmlFormattedSchedule = xmlFormat(UglovoiXmlSchedule);

        fileSystem.createMultipleFoldersRecursively([YabloneviyFolderPath, UglovoiFolderPath]);
        fileSystem.writeFileSync(YabloneviyXmlPath, YabloneviyXmlFormattedSchedule);
        fileSystem.writeFileSync(UglovoiXmlPath, UglovoiXmlFormattedSchedule);
    }

}
export const xmlUtilities = new XmlUtilities;