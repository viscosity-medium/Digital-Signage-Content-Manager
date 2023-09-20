import Client, {Options} from "ftp";
import process from "process";

export interface MmsPlayerProps {
    fileSystemPath: string
    playerId: string
}

class FtpUtilities{

    async uploadContentToMmsPlayers(mmsPlayers: MmsPlayerProps[]){

        const ftpClientInstance = new Client();
        const ftpConfig: Options = {
            host: "127.0.0.1",
            port: 18998,
            user: "FELDTECH",
            password: "FELDTECH1",
        }

        console.log(ftpConfig);

        try{

            await ftpClientInstance.connect(ftpConfig);

            const connectedClient: Client = await new Promise(async resolve => {
                await ftpClientInstance.on("ready", ()=>{
                    console.log("\x1b[37m", "Подключено");
                    resolve(ftpClientInstance);
                })
            })

            for await (const {fileSystemPath, playerId} of mmsPlayers) {
    
                await new Promise(async (resolve) => {
                    await connectedClient.put(fileSystemPath, `/${playerId}/_schedules/0_0_0.xml`, (err) => {
                        if (err && err.toString().match("Cannot STOR. invalid path!")) {
                            console.log("\x1b[31m", `Invalid path for player ${playerId}`);
                        } else if (err !== undefined){
                            console.log("\x1b[31m", err);
                        }
                    })

                    resolve("")
                });
    
            }

        } catch(err){
            console.log(err)
        }

    }

}

export const ftpUtilities = new FtpUtilities();