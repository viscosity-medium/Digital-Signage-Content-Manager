import xml2js from "xml2js";
import {fileSystem} from "./fileSystem.utilities";
import {
    CreateMultipleXmlSchedules,
    CreateXmlSchedule,
    GetSeparatedScreenSchedules
} from "../types/recursiveCycle.types";
import {folderMultiItem} from "../xml/_xml_elements/folderMultiItem";
import path from "path";
import {calculateActiveDays, calculateTimeDuration} from "./converter";
import {videoItem} from "../xml/_xml_elements/videoItem";
import {pictureItem} from "../xml/_xml_elements/pictureItem";
import {regExpConditionToDeleteIntermediateFoldersOnPath} from "../system/environmental";
import {ScheduleStructure} from "../types/scheduleStucture.types";
import {GetSeparatedScheduleItems, StaticFolders} from "../types/xml.types";
import {createXmlContent} from "../xml/_xml_elements/xmlBase";
import xmlFormat from "xml-formatter";

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
                const timeDuration = calculateTimeDuration({timeDuration: currentItem.limits.time});

                if(currentItem.mimeType?.match("video")){

                    return (`${
                        accumulator
                    }${
                        videoItem({
                            relativeMmsMediaPoolFilePath,
                            dateLimits,
                            timeDuration
                        })
                    }`);

                } else if(currentItem.mimeType?.match("image")) {
                    return (`${
                        accumulator
                    }${
                        pictureItem({
                            relativeMmsMediaPoolFilePath,
                            dateLimits,
                            timeDuration
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

    getSeparatedScreenSchedules: GetSeparatedScreenSchedules = (parentItem) => {

        return parentItem.reduce((accumulator, currentItem) => {

            if(currentItem.type === "folder"){

                if(currentItem.name === StaticFolders.rootDirectory){
                    return this.getSeparatedScreenSchedules(currentItem.content)
                } else if ([StaticFolders.Yabloneviy, StaticFolders.Uglovoi].includes(currentItem.name as StaticFolders)){
                    return {
                        ...accumulator,
                        [currentItem.name]: currentItem.content.reduce((innerAccum, innerItem) => {
                            if(innerItem.name === StaticFolders.Day){
                                return {
                                    ...innerAccum,
                                    [StaticFolders.Day]: innerItem
                                }
                            } else if (innerItem.name === StaticFolders.Night){
                                return {
                                    ...innerAccum,
                                    [StaticFolders.Night]: innerItem
                                }
                            }
                        },{})
                    }
                }

            }

        },{
            [StaticFolders.Yabloneviy]: {
                [StaticFolders.Day]: undefined,
                [StaticFolders.Night]: undefined
            },
            [StaticFolders.Uglovoi]: {
                [StaticFolders.Day]: undefined,
                [StaticFolders.Night]: undefined
            }
        })

    };

    formSeparatedXmlFiles = ({
        Yabloneviy,
        Uglovoi
    }: GetSeparatedScheduleItems): {
        YabloneviyXmlSchedule: string,
        UglovoiXmlSchedule: string
    } => {

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

    separateXmlScheduleAndWriteXmlFilesToFileSystem({newScheduleData}: {newScheduleData: ScheduleStructure}){

        const { Yabloneviy, Uglovoi } = xmlUtilities.getSeparatedScreenSchedules(newScheduleData);
        const { YabloneviyXmlSchedule, UglovoiXmlSchedule } = xmlUtilities.formSeparatedXmlFiles({ Yabloneviy, Uglovoi });

        xmlUtilities.writeXmlFilesToFileSystem({ YabloneviyXmlSchedule, UglovoiXmlSchedule });

    }

}
export const xmlUtilities = new XmlUtilities;