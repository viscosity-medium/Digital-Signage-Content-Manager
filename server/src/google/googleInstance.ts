import {google} from "googleapis"
import * as process from "process";

const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URL);
oauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN});

export const driveInstance = google.drive(({
    version: "v3",
    auth: oauth2Client
}));

export const example = "hey"

