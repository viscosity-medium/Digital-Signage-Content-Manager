import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    fetchScheduleStructure,
    updateScheduleStructure,
    uploadXmlFilesOnMmsServer
} from "@/widgets/Schedule/model/Schedule.asyncThunks";
import {ScheduleScheme} from "@/widgets/Schedule/model/Schedule.types";
import {ScheduleFileInterface} from "@/widgets/Schedule/model/Schedule.types";
import {ScheduleFolderInterface} from "@/widgets/Schedule/model/Schedule.types";
import {getChildrenFolderContent, getChildrenFolderName} from "@/widgets/Schedule/model/Schedule.helpers";
import {Identifier} from "dnd-core";
import {useAppDispatch} from "../../../../store/store";
import {modalActions} from "@/widgets/Modal/model/Modal.slice";

const initialState: ScheduleScheme = {
    scheduleStructure: [],
    activeItem: null,
    activeItemIndex: undefined,
    activeDirectoryId: "rootDirectory",
    activeDirectoryName: "rootDirectory",
    activeDirectoryScheduleItems: []
}

const scheduleSlice = createSlice({
    name: "schedule",
    initialState,
    reducers: {
        setScheduleStructure: (state, action: PayloadAction<Array<ScheduleFileInterface | ScheduleFolderInterface>>) => {
            state.scheduleStructure = action.payload
        },
        setActiveItem: (state, action: PayloadAction<Identifier | null>) => {state.activeItem = action.payload},
        setActiveItemIndex: (state, action: PayloadAction<number | undefined>) => {state.activeItemIndex = action.payload},
        setActiveDirectoryId: (state, action: PayloadAction<string>) => {state.activeDirectoryId = action.payload},
        setActiveDirectoryName: (state, action: PayloadAction<string>) => {state.activeDirectoryName = action.payload},
        setActiveDirectoryItems: (state, action: PayloadAction<Array<ScheduleFileInterface | ScheduleFolderInterface>>) => {state.activeDirectoryScheduleItems = action.payload},
    },
    extraReducers: (builder) => {

        // fetchScheduleStructure
        builder.addCase(fetchScheduleStructure.fulfilled, (state, action: PayloadAction<Array<ScheduleFolderInterface>>)=> {

            const directoryItems = getChildrenFolderContent(action.payload, state.activeDirectoryId);
            const directoryName = getChildrenFolderName(action.payload, state.activeDirectoryId);
       
            state.scheduleStructure = action.payload;
            state.activeDirectoryScheduleItems = directoryItems;
            state.activeDirectoryName = directoryName;

        });
        builder.addCase(fetchScheduleStructure.rejected, (state, action) => {
            console.log(action)
        });

        // update schedule structure
        builder.addCase(updateScheduleStructure.fulfilled, (state, action: PayloadAction<{
            newSchedule: Array<ScheduleFileInterface | ScheduleFolderInterface>,
            response: string
        }>)=> {
            state.scheduleStructure = action?.payload?.newSchedule;
        });

        // upload xml files on mms server
        builder.addCase(uploadXmlFilesOnMmsServer.fulfilled, (state, action: PayloadAction<{
            response: string,
            error: string
        }>) => {

        })
    }
});

export const {
    reducer: scheduleReducer,
    actions: scheduleActions
} = scheduleSlice;