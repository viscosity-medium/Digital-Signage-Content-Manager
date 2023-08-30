import {createAsyncThunk} from "@reduxjs/toolkit";
import {axiosApi} from "@/shared/api/api";
import {AxiosResponse} from "axios";
import {SidebarStructure} from "@/widgets/Sidebar/model/Sidebar.type";

export const fetchSidebarStructure = createAsyncThunk(
    "sidebarStructure",
    async () => {
        const axiosResponse: AxiosResponse<SidebarStructure> = await axiosApi.get("get-folder-structure");
        return axiosResponse.data;
    }
)