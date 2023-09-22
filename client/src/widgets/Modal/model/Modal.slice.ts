import {createSlice} from "@reduxjs/toolkit";

export interface ModalSchema {
    modalIsShown: boolean
    contentType: any
    modalContent: {
        response: string | undefined
        error: string | undefined
    }
}

const initialState: ModalSchema = {
    modalIsShown: false,
    contentType: "upload",
    modalContent: {
        response: undefined,
        error: undefined
    }
};

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        setModalIsShown: (state) => { state.modalIsShown = !state.modalIsShown },
        setModalIsContent: (state, action) => { state.modalContent = action.payload },
    }
});

export const {
    actions: modalActions,
    reducer: modalReducer
} = modalSlice;