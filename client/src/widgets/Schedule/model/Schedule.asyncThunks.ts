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

        const axiosResponse: AxiosResponse<{
            schedule: Array<ScheduleFolderInterface>
            response: string
        }> = await axiosApi.put("update-schedule-structure", {
            scheduleStructure
        });

        return {
            newSchedule: axiosResponse?.data?.schedule,
            response: axiosResponse?.data?.response
        };

    }
)

export const uploadXmlFilesOnMmsServer = createAsyncThunk(
    "schedule/uploadXmlFilesOnMmsServer",
    async () => {

        const axiosResponse: AxiosResponse<{
            response: string
            error: string
        }> = await axiosApi.get("upload-xml-files-to-mms");

        return {
            response: axiosResponse?.data?.response,
            error: axiosResponse?.data?.error
        };

    }
)