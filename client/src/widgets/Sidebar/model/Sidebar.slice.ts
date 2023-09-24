import {fetchActualGoogleStructure, fetchSidebarStructure} from "./Sidebar.asyncThunks";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SidebarScheme, SidebarStructure} from "./Sidebar.type";

const initialState: SidebarScheme = {
    structure: {},
    searchBarValue: ""
};


const Sidebar = createSlice({
    name: "Sidebar",
    initialState,
    reducers: {
        setSearchBarValue: (state, action: PayloadAction<string>) => { state.searchBarValue = action.payload }
    },
    extraReducers: (builder) => {

        builder.addCase(fetchSidebarStructure.fulfilled, (state, action: PayloadAction<SidebarStructure>) => {
            state.structure = action.payload;
        })

        builder.addCase(fetchActualGoogleStructure.fulfilled, (state, action: PayloadAction<{
            schedule: SidebarStructure,
            response: string
        }>) => {
            state.structure = action.payload.schedule
        })
    }
})

export const {
    reducer: sidebarReducer,
    actions: sidebarActions
} = Sidebar