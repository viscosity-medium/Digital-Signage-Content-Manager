import * as xml2js from "xml2js";
import {fileSystem} from "./fileSystem.utilities";


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

}
export const xmlUtilities = new XmlUtilities;