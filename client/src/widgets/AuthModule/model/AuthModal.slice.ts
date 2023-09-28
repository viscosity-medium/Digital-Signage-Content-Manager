import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface AuthModuleScheme {
    login: string,
    password: string
}

const initialState: AuthModuleScheme = {
    login: "",
    password: ""
}

const authModal = createSlice({
    name: "authModule",
    initialState,
    reducers: {
        setLogin: (state: AuthModuleScheme, action: PayloadAction<string>) => {state.login = action.payload},
        setPassword: (state: AuthModuleScheme, action: PayloadAction<string>) => {state.password = action.payload},
    }
});

export const {
    reducer: authModuleReducer,
    actions: authModuleActions
} = authModal;