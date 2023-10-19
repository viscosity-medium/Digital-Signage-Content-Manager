import {StateScheme} from "@/store/stateScheme";

export const getModalState = (state: StateScheme) => state.modal.modalIsShown;
export const getModalContent = (state: StateScheme) => state.modal.modalContent;