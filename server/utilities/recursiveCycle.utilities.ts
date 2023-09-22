import {StaticFolders, StaticFoldersGoogle} from "../types/xml.types";
import {
    GetActualGoogleFilesList,
    GetSeparatedScreenSchedules,
    GetUniqueFilesList,
    GoogleItem
} from "../types/recursiveCycle.types";

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

