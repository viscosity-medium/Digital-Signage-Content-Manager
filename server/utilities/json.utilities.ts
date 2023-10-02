import {fileSystem} from "./fileSystem.utilities";

class JsonUtilities{

    getActualFilesListFromJson(jsonPath: string){

        const jsonData = JSON.parse(fileSystem.readFileSync(jsonPath).toString());

        return jsonData["easescreen"]["TMultiItem"].reduce((accumulator, scheduleItem) => {

            const commentString = scheduleItem["Comment"].join("");
            const items = scheduleItem["Items"];

            const blockItems = items[0]["TMultiItem"].map((blockItem, blockIndex) => {

                const blockArrayList = this.collectFileNamesInArrayRecursively(blockItem["Items"][0]);
                const modifiedBlockArrayList = this.formatFilesListArray(blockArrayList);

                return({
                    [`blockItem_${blockIndex + 1}`]: modifiedBlockArrayList
                });

            })

            if(commentString.match("Night")){

                return {
                    ... accumulator,
                    night: blockItems
                }

            } else if(commentString.match("Day")){

                return {
                    ... accumulator,
                    day: blockItems
                }

            }

            return accumulator

        }, {});

    }

    collectFileNamesInArrayRecursively = (multiItems) => {

        const results = [];
        const keys = Object.keys(multiItems);

        keys.forEach((singleKey)=>{
            if(singleKey === "TMultiItem"){
                const innerMultiItems = this.collectFileNamesInArrayRecursively(multiItems["TMultiItem"][0]);
                results.push(...innerMultiItems)
            } else if (singleKey === "TMovieItem"){
                const innerMovieItems = multiItems["TMovieItem"].map((movieItem) => (
                    movieItem["FileName"][0]
                ));
                results.push(...innerMovieItems);
            } else if (singleKey === "TPictureItem"){
                const innerPictureItem = multiItems["TPictureItem"].map((pictureItem) => (
                    pictureItem["FileName"][0]
                ));
                results.push(...innerPictureItem)
            }
        })

        return results;

    }

    formatFilesListArray = (content: string[]) => {

        return content.map(item => {
            const shortenedString = item.replace(/'(\s*|\r*|\n*|"*|\\n*|\\r*|\+*|())*'|^\s*|(\s\+(\n|\r)*|\s*|")/gm, "");
            return ("C:\\mms\\Media\\" + shortenedString.replace(/'|"/gm,""))
        });

    };

}

export const jsonUtilities = new JsonUtilities();