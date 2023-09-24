import Client, {Options} from "ftp";
import process from "process";

export interface MmsPlayerProps {
    playerName: string
    fileSystemPath: string
    playerId: string
}

class FtpUtilities{

    async uploadMultipleXmlFilesToMms(mmsPlayers: MmsPlayerProps[]){

        const ftpClientInstance = new Client();
        const ftpConfig: Options = {
            host: "127.0.0.1",
            port: 18998,
            user: "FELDTECH",
            password: "FELDTECH1",
        }

        try{

            // const connectedClient: Client = await new Promise(resolve => {
            //     ftpClientInstance.connect(ftpConfig);
            //     ftpClientInstance.on("ready", ()=>{
            //         console.log("\x1b[37m", "Подключено");
            //         resolve(ftpClientInstance);
            //     })
            // })

            // for await (const {fileSystemPath, playerId} of mmsPlayers) {
            //
            //     await new Promise(async (resolve) => {
            //         connectedClient.put(fileSystemPath, `/${playerId}/_schedules/0_0_0.xml`, (err) => {
            //             if (err && err.toString().match("Cannot STOR. invalid path!")) {
            //                 console.log("\x1b[31m", `Invalid path for player ${playerId}`);
            //             } else if (err !== undefined){
            //                 console.log("\x1b[31m", err);
            //             }
            //         })
            //
            //         resolve("")
            //     });
            //
            // }

            return {
                response: "Обновлённое расписание успешно загружено на сервер."
            }

        } catch(err){
            console.log(err);

            return {
                response: "На сервере произошла ошибка",
                error: err
            }
        }

    }

}

export const ftpUtilities = new FtpUtilities();