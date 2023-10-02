import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface ModalContent {
    response: string | undefined
    error?: string | undefined
}

export interface ModalSchema {
    modalIsShown: boolean
    modalContent: ModalContent
}

const initialState: ModalSchema = {
    modalIsShown: false,
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