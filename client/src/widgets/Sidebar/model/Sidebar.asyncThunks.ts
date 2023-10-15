import {createAsyncThunk} from "@reduxjs/toolkit";
import {axiosApi} from "@/shared/api/api";
import {AxiosResponse} from "axios";
import {SidebarStructure} from "./Sidebar.type";

export const fetchActualGoogleStructure = createAsyncThunk(
    "googleStructure",
    async () => {
        const axiosResponse: AxiosResponse<{
            schedule: SidebarStructure,
            response: string
        }> = await axiosApi.get("get-actual-google-data");
        console.log(axiosResponse.data)
        return axiosResponse.data;
    }
)

export const fetchSidebarStructure = createAsyncThunk(
    "sidebarStructure",
    async () => {
        const axiosResponse: AxiosResponse<SidebarStructure> = await axiosApi.get("get-google-drive-structure");
        return axiosResponse.data;
    }
)