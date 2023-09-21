import {StaticFolders, StaticFoldersGoogle} from "../types/xml.types";
import {xmlBase} from "../xml/_xml_elements/xmlBase";
import xmlFormat from "xml-formatter";
import {
    GetActualGoogleFilesList,
    GetSeparatedScreenSchedules,
    GetUniqueFilesList,
    GoogleItem
} from "../types/recursiveCycle.types";
import {fileSystem} from "./fileSystem.utilities";
import {xmlUtilities} from "./xml.utilities";
import {ftpUtilities} from "./ftp.utilitie";

export const getActualGoogleFilesList: GetActualGoogleFilesList = (structure) => {

    if(structure.mimeType === "folder"){

        return Object.values(structure)[0].reduce((accumulator: string[], currentItem: GoogleItem) => {
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

export const getSeparatedScreenSchedules: GetSeparatedScreenSchedules = (parentItem) => {

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

export const getSeparatedFileListFromGoogleStructure: any = (parentItem) => {

    const getWholeContentListOnOneLevel = (contentItem) => {
        return contentItem[Object.keys(contentItem)[0]].reduce((accumulator, currentItem)=>{
            if(currentItem.mimeType === "folder"){
                return [
                    ...accumulator,
                    ...getWholeContentListOnOneLevel(currentItem)
                ]
            } else {
                return [
                    ...accumulator,
                    {
                        name: currentItem.name,
                        id: currentItem.id
                    }
                ]
            }
        },[])


    }

    const execute = (element) => {
        return element.reduce((accumulator, currentItem) => {

            if(currentItem.mimeType === "folder"){
                if(currentItem.name === StaticFoldersGoogle.rootDirectory){
                    return getSeparatedScreenSchedules(currentItem[0])
                } else if ([StaticFoldersGoogle.yabloneviy, StaticFoldersGoogle.uglovoi].includes(currentItem.name as StaticFoldersGoogle)){
                    return {
                        ...accumulator,
                        [currentItem.name]: currentItem[Object.keys(currentItem)[0]].reduce((innerAccum, innerItem) => {

                            const nonFilteredCollection = getWholeContentListOnOneLevel(innerItem);
                            const filteredCollection = nonFilteredCollection.reduce((filteredAccumulator, nonfilteredItem) => {

                                const onlyNames = filteredAccumulator.map(filteredItem => filteredItem.name);

                                if(!onlyNames.includes(nonfilteredItem.name)){
                                    return [...filteredAccumulator, nonfilteredItem]
                                } else {
                                    return filteredAccumulator
                                }
                            },[])

                            if(innerItem.name === StaticFoldersGoogle.day){
                                return {
                                    ...innerAccum,
                                    [StaticFoldersGoogle.day]: filteredCollection
                                }
                            } else if (innerItem.name === StaticFoldersGoogle.night){
                                return {
                                    ...innerAccum,
                                    [StaticFoldersGoogle.night]: filteredCollection
                                }
                            }
                        },{})
                    }
                }

            }

        },{
            [StaticFoldersGoogle.yabloneviy]: {
                [StaticFoldersGoogle.day]: undefined,
                [StaticFoldersGoogle.night]: undefined
            },
            [StaticFoldersGoogle.uglovoi]: {
                [StaticFoldersGoogle.day]: undefined,
                [StaticFoldersGoogle.night]: undefined
            }
        })
    }

    if(Array.isArray(parentItem)){

        return execute(parentItem);

    } else {

        const key = Object.keys(parentItem)[0];
        return execute(parentItem[key]);

    }

};

export const getUniqueFilesList: GetUniqueFilesList = (
    structure,
    startArray
) => {

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

export const processSchedule = async ({schedule}: {schedule: any[]}) => {

    const {
        Yabloneviy,
        Uglovoi
    } = getSeparatedScreenSchedules(schedule);

    const uniqueYabloneviyDayList = getUniqueFilesList(Yabloneviy[StaticFolders.Day].content, []);
    const uniqueYabloneviyNightList = getUniqueFilesList(Yabloneviy[StaticFolders.Night].content, []);
    const uniqueUglovoiDayList = getUniqueFilesList(Uglovoi[StaticFolders.Day].content, []);
    const uniqueUglovoiNightList = getUniqueFilesList(Uglovoi[StaticFolders.Night].content, []);

    console.log(uniqueYabloneviyDayList);
    console.log(uniqueYabloneviyNightList);
    console.log(uniqueUglovoiDayList);
    console.log(uniqueUglovoiNightList);

    const yabloneviyDayFolderPath = fileSystem.joinPath([process.env.EASESCREEN_MMS_MEDIA_FOLDER, "yabloneviy", "day"]);
    const yabloneviyNightFolderPath = fileSystem.joinPath([process.env.EASESCREEN_MMS_MEDIA_FOLDER, "yabloneviy", "night"]);
    const uglovoyDayFolderPath = fileSystem.joinPath([process.env.EASESCREEN_MMS_MEDIA_FOLDER, "uglovoi", "day"]);
    const uglovoyNightFolderPath = fileSystem.joinPath([process.env.EASESCREEN_MMS_MEDIA_FOLDER, "uglovoi", "night"]);

    const YabloneviyDaySchedule = xmlUtilities.createXmlSchedule({
        schedule: Yabloneviy[StaticFolders.Day].content,
        folderWithContentPath: yabloneviyDayFolderPath
    });
    const YabloneviyNightSchedule = xmlUtilities.createXmlSchedule({
        schedule: Yabloneviy[StaticFolders.Night].content,
        folderWithContentPath: yabloneviyNightFolderPath
    });
    const UglovoiDaySchedule = xmlUtilities.createXmlSchedule({
        schedule: Uglovoi[StaticFolders.Day].content,
        folderWithContentPath: uglovoyDayFolderPath
    });
    const UglovoiNightSchedule = xmlUtilities.createXmlSchedule({
        schedule: Uglovoi[StaticFolders.Night].content,
        folderWithContentPath: uglovoyNightFolderPath
    });

    const YabloneviyXmlSchedule = xmlBase(YabloneviyDaySchedule, YabloneviyNightSchedule);
    const UglovoiXmlSchedule = xmlBase(UglovoiDaySchedule, UglovoiNightSchedule);

    const YabloneviyFolderPath = fileSystem.createAbsolutePathFromProjectRoot(["xml", "yabloneviy"]);
    const UglovoiFolderPath = fileSystem.createAbsolutePathFromProjectRoot(["xml", "uglovoi"]);
    const YabloneviyXmlPath = fileSystem.createAbsolutePathFromProjectRoot(["xml", "yabloneviy", "0_0_0.xml"]);
    const UglovoiXmlPath = fileSystem.createAbsolutePathFromProjectRoot(["xml", "uglovoi", "0_0_0.xml"]);

    const uniqueFilesList = getUniqueFilesList(schedule, []);

    const YabloneviyXmlFormattedSchedule = xmlFormat(YabloneviyXmlSchedule);
    const UglovoiXmlFormattedSchedule = xmlFormat(UglovoiXmlSchedule);

    fileSystem.createMultipleFoldersRecursively([
        YabloneviyFolderPath,
        UglovoiFolderPath
    ]);

    fileSystem.writeFileSync(YabloneviyXmlPath, YabloneviyXmlFormattedSchedule);
    fileSystem.writeFileSync(UglovoiXmlPath, UglovoiXmlFormattedSchedule);

    await ftpUtilities.uploadContentToMmsPlayers([
        {
            playerId: "{318A5E69-E22C-4141-95F5-DBF77E176ABF}",
            fileSystemPath: YabloneviyXmlPath
        }
    ])

    return("");

}