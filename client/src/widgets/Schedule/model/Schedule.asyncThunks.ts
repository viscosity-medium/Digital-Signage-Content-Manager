import {createAsyncThunk} from "@reduxjs/toolkit";
import {axiosApi} from "@/shared/api/api";
import {AxiosResponse} from "axios";

import {
    ScheduleFileInterface,
    ScheduleFolderInterface,
    ScheduleItemProps
} from "@/widgets/Schedule/model/Schedule.types";
import {useAppDispatch} from "../../../../store/store";
import {modalActions} from "@/widgets/Modal/model/Modal.slice";

export const fetchScheduleStructure = createAsyncThunk(
    "schedule/fetchScheduleStructure",
    async () => {
        const axiosResponse: AxiosResponse<Array<ScheduleFolderInterface>> = await axiosApi.get("get-schedule-structure");
        return axiosResponse.data;
    }
);

export const updateScheduleStructure = createAsyncThunk(
    "schedule/updateScheduleStructure",
    async ({scheduleStructure}: {scheduleStructure: Array<ScheduleFolderInterface | ScheduleFileInterface>}) => {

        const axiosResponse: AxiosResponse<Array<ScheduleFolderInterface>> = await axiosApi.put("update-schedule-structure", {
            scheduleStructure
        });

        return axiosResponse.data;

    }
)