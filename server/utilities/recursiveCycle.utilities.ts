import {ScheduleFileInterface, ScheduleFolderInterface, ScheduleStructure} from "../types/scheduleStucture.types";
import {GetSeparatedScheduleItems, StaticFolders} from "../types/xml.types";
import {videoItem} from "../xml/_xml_elements/videoItem";
import {pictureItem} from "../xml/_xml_elements/pictureItem";
import {folderMultiItem} from "../xml/_xml_elements/folderMultiItem";
import {xmlBase} from "../xml/_xml_elements/xmlBase";
import * as path from "path";
import * as fs from "fs";

export interface GoogleFile {
    kind: string,
    mimeType: string,
    thumbnailLink: string,
    id: string,
    name: string
}

export interface GoogleFolder {
    [key: string]: Array<GoogleFile | GoogleFolder> | any,
    name: string
    mimeType: string
}

export const getActualGoogleFilesList = (structure: GoogleFolder | GoogleFile): string[] => {

    if(structure.mimeType === "folder"){

        return Object.values(structure)[0].reduce((accumulator: string[], currentItem: GoogleFolder | GoogleFile) => {
            if(Object.keys(currentItem).length > 1){
                return [
                    ...accumulator,
                    currentItem.name
                ]
            } else {
                return [
                    ...accumulator,
                    ...getActualGoogleFilesList(currentItem)
                ]
            }
        },[])

    }

}

const getSeparatedScreenSchedules = (parentItem: (ScheduleFolderInterface | ScheduleFileInterface)[]): GetSeparatedScheduleItems => {

    return parentItem.reduce((accumulator, currentItem) => {

       if(currentItem.type === "folder"){

           if(currentItem.name === StaticFolders.rootDirectory){
               return getSeparatedScreenSchedules(currentItem.content)
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

const createXmlSchedule = (schedule: ScheduleStructure, folderWithContentPath: string): string => {

    return schedule.reduce((accumulator, currentItem) => {

        if(currentItem.type === "folder"){

            return (`${
                accumulator
            }${
                folderMultiItem(createXmlSchedule(currentItem.content, folderWithContentPath))
            }`);

        } else {

            const fullFilePath = path.join(folderWithContentPath, currentItem.name)

            if(currentItem.mimeType.match("video")){
                return (`${
                    accumulator
                }${
                    videoItem(fullFilePath)
                }`)
            } else if(currentItem.mimeType.match("image")) {
                return (`${
                    accumulator
                }${
                    pictureItem(fullFilePath)
                }`)
            } else {
                return (`${accumulator}`)
            }

        }

    }, "")

}

export const getUniqueFilesList = (
    structure: (ScheduleFolderInterface | ScheduleFileInterface)[],
    startArray: string[]
): string[] => {

    const results = [];
    const setList = new Set(structure.reduce((accumulator, currentItem): string[] => {

        if(currentItem.type === "file"){
            return [...accumulator, currentItem.name]
        } else {
            return [
                ...accumulator,
                ...getUniqueFilesList(currentItem.content, startArray)
            ];
        }

    }, startArray));

    for(const value of setList.values()){
        results.push(value);
    }

    return results;

}

export const copyFilesToMediaPool = async (
    filesArray: string[],
    pathTo: string
) => {

    const downloadedFilesFromGoogleFolder = path.join(process.cwd(), "folderStructure");
    const filesInFolder = fs.readdirSync(downloadedFilesFromGoogleFolder);

    const recursiveSearch = async (arr: string[], str: string) => {

        for await (const item of arr) {
            await new Promise((resolve, reject) => {
                const sourcePath = path.join(str, item);
                if(fs.statSync(sourcePath).isDirectory()){

                    const newArray = fs.readdirSync(sourcePath);
                    recursiveSearch(newArray, sourcePath);

                } else {
                    if(filesArray.includes(item)){

                        const copyPath = path.join(pathTo, item);
                        fs.copyFileSync(sourcePath, copyPath);

                    }
                }
                resolve("")
            });
        }

    }

    await recursiveSearch(filesInFolder, downloadedFilesFromGoogleFolder)

}

export const processSchedule = async ({schedule}: {schedule: any[]}) => {

    const {Yabloneviy, Uglovoi} = getSeparatedScreenSchedules(schedule);

    const uniqueYabloneviyDayList = getUniqueFilesList(Yabloneviy[StaticFolders.Day].content, []);
    const uniqueYabloneviyNightList = getUniqueFilesList(Yabloneviy[StaticFolders.Night].content, []);
    const uniqueUglovoiDayList = getUniqueFilesList(Uglovoi[StaticFolders.Day].content, []);
    const uniqueUglovoiNightList = getUniqueFilesList(Uglovoi[StaticFolders.Night].content, []);

    const pathYabloneviyDayToCopy = path.join(process.env.EASESCREEN_MMS_MEDIA_FOLDER, "yabloneviy", "day");
    const pathYabloneviyNightToCopy = path.join(process.env.EASESCREEN_MMS_MEDIA_FOLDER, "yabloneviy", "night");
    const pathUglovoiDayToCopy = path.join(process.env.EASESCREEN_MMS_MEDIA_FOLDER, "uglovoi", "day");
    const pathUglovoiNightToCopy = path.join(process.env.EASESCREEN_MMS_MEDIA_FOLDER, "uglovoi", "day");

    uniqueYabloneviyDayList.length !== 0 && await copyFilesToMediaPool(uniqueYabloneviyDayList, pathYabloneviyDayToCopy);
    pathYabloneviyNightToCopy.length !== 0 && await copyFilesToMediaPool(uniqueYabloneviyNightList, pathYabloneviyNightToCopy);
    pathUglovoiDayToCopy.length !== 0 && await copyFilesToMediaPool(uniqueUglovoiDayList, pathUglovoiDayToCopy);
    pathUglovoiNightToCopy.length !== 0 && await copyFilesToMediaPool(uniqueUglovoiNightList, pathUglovoiNightToCopy);

    // console.log(uniqueYabloneviyDayList);
    // console.log(uniqueYabloneviyNightList);
    // console.log(uniqueUglovoiDayList);
    // console.log(uniqueUglovoiNightList);

    const YabloneviyDaySchedule = createXmlSchedule(Yabloneviy[StaticFolders.Day].content, pathYabloneviyDayToCopy);
    const YabloneviyNightSchedule = createXmlSchedule(Yabloneviy[StaticFolders.Night].content, pathYabloneviyNightToCopy);

    const UglovoiDaySchedule = createXmlSchedule(Uglovoi[StaticFolders.Day].content, pathUglovoiDayToCopy);
    const UglovoiNightSchedule = createXmlSchedule(Uglovoi[StaticFolders.Night].content, pathUglovoiNightToCopy);

    const YabloneviyXmlSchedule = xmlBase(YabloneviyDaySchedule, YabloneviyNightSchedule);
    const UglovoiXmlSchedule = xmlBase(UglovoiDaySchedule, UglovoiNightSchedule);

    const testXmlPath = path.join(process.cwd(), "xml", "_test", "testXml.xml");

    const uniqueFilesList = getUniqueFilesList(schedule, []);

    // console.log(uniqueFilesList);

    fs.writeFileSync(testXmlPath, YabloneviyXmlSchedule);

    return("");

}