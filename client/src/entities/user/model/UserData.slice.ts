import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface UserDataSchema {
    login: string | null | undefined
    password: string | null | undefined
}

const initialState: UserDataSchema = {
    login: undefined,
    password: undefined
}

const userData = createSlice({
    name: "user-data",
    initialState,
    reducers: {
        setLogin: (state, action: PayloadAction<string | null>) => {state.login = action.payload},
        setPassword: (state, action: PayloadAction<string | null>) => {state.password = action.payload}
    }
})

export const {
    reducer: userDataReducer,
    actions: userDataActions
} = userData;