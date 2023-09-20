import {StaticFolders} from "../types/xml.types";
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

    //console.log(JSON.stringify(Yabloneviy["Day"], null, 4));

    const uniqueYabloneviyDayList = getUniqueFilesList(Yabloneviy[StaticFolders.Day].content, []);
    const uniqueYabloneviyNightList = getUniqueFilesList(Yabloneviy[StaticFolders.Night].content, []);
    const uniqueUglovoiDayList = getUniqueFilesList(Uglovoi[StaticFolders.Day].content, []);
    const uniqueUglovoiNightList = getUniqueFilesList(Uglovoi[StaticFolders.Night].content, []);

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

    // console.log(uniqueYabloneviyDayList);
    // console.log(uniqueYabloneviyNightList);
    // console.log(uniqueUglovoiDayList);
    // console.log(uniqueUglovoiNightList);

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