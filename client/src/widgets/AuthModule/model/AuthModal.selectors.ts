import {StateScheme} from "../../../../store/stateScheme";

export const getAuthModuleLogin = (state: StateScheme) => state.authModule.login;
export const getAuthModulePassword = (state: StateScheme) => state.authModule.password;