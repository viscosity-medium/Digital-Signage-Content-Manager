import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface ModalContent {
    response: string | undefined
    error?: string | undefined
}

export interface ModalSchema {
    modalIsShown: boolean
    contentType: any
    modalContent: ModalContent
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
        setModalIsShown: (state, action: PayloadAction<boolean>) => { state.modalIsShown = action.payload },
        setModalContent: (state, action: PayloadAction<ModalContent>) => { state.modalContent = action.payload },
    }
});

export const {
    actions: modalActions,
    reducer: modalReducer
} = modalSlice;