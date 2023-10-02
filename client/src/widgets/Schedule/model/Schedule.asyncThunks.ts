import {createAsyncThunk} from "@reduxjs/toolkit";
import {axiosApi} from "@/shared/api/api";
import {AxiosResponse} from "axios";

import {ScheduleFolderInterface, ScheduleItemInterface} from "@/widgets/Schedule/model/Schedule.types";

export const fetchScheduleStructure = createAsyncThunk(
    "schedule/fetchScheduleStructure",
    async () => {
        const axiosResponse: AxiosResponse<Array<ScheduleFolderInterface>> = await axiosApi.get("get-schedule-structure");
        return axiosResponse.data;
    }
);

export const updateScheduleStructure = createAsyncThunk(
    "schedule/updateScheduleStructure",
    async ({scheduleStructure}: {scheduleStructure: Array<ScheduleItemInterface>}) => {

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
    async ({scheduleStructure}: {scheduleStructure: Array<ScheduleItemInterface>}) => {

        const axiosResponse: AxiosResponse<{
            response: string
            error: string
        }> = await axiosApi.put("upload-xml-files-to-mms", {
            scheduleStructure
        });

        return {
            response: axiosResponse?.data?.response,
            error: axiosResponse?.data?.error
        };

    }
)