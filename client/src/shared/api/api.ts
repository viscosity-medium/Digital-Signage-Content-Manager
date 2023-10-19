import axios from "axios";

const headers = {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
}

export const axiosApi = axios.create({
    headers: headers,
    baseURL: process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_URL_DEV : process.env.NEXT_PUBLIC_URL_PROD
})