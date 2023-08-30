import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchScheduleStructure, updateScheduleStructure} from "@/widgets/Schedule/model/Schedule.asyncThunks";
import {ScheduleScheme} from "@/widgets/Schedule/model/Schedule.types";
import {ScheduleFileInterface} from "@/widgets/Schedule/model/Schedule.types";
import {ScheduleFolderInterface} from "@/widgets/Schedule/model/Schedule.types";
import {getChildrenFolderContent} from "@/widgets/Schedule/model/Schedule.helpers";
import {Identifier} from "dnd-core";
import {useAppDispatch} from "../../../../store/store";
import {modalActions} from "@/widgets/Modal/model/Modal.slice";

const initialState: ScheduleScheme = {
    scheduleStructure: [],
    activeItem: null,
    activeItemIndex: undefined,
    activeDirectory: "rootDirectory",
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
        setActiveDirectory: (state, action: PayloadAction<string>) => {state.activeDirectory = action.payload},
        setActiveDirectoryItems: (state, action: PayloadAction<Array<ScheduleFileInterface | ScheduleFolderInterface>>) => {state.activeDirectoryScheduleItems = action.payload},
    },
    extraReducers: (builder) => {

        // fetchScheduleStructure
        builder.addCase(fetchScheduleStructure.fulfilled, (state, action: PayloadAction<Array<ScheduleFolderInterface>>)=> {

            const data = getChildrenFolderContent(action.payload, "rootDirectory");

            state.scheduleStructure = action.payload;
            state.activeDirectoryScheduleItems = data;

        });

        // updateScheduleStructure
        builder.addCase(updateScheduleStructure.fulfilled, (state, action: PayloadAction<Array<ScheduleFileInterface | ScheduleFolderInterface>>)=> {
            state.scheduleStructure = action.payload;
        });

    }
});

export const {
    reducer: scheduleReducer,
    actions: scheduleActions
} = scheduleSlice;