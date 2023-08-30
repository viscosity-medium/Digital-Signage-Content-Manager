import {createSlice} from "@reduxjs/toolkit";

export interface ModalSchema {
    modalIsShown: boolean
    contentType: any
}

const initialState: ModalSchema = {
    modalIsShown: false,
    contentType: "upload"
};

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        setModalIsShown: (state) => { state.modalIsShown = !state.modalIsShown }
    }
});

export const {
    actions: modalActions,
    reducer: modalReducer
} = modalSlice;