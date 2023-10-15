import {configureStore} from "@reduxjs/toolkit";
import {sidebarReducer} from "@/widgets/Sidebar/model/Sidebar.slice";
import {useDispatch} from "react-redux";
import {scheduleReducer} from "@/widgets/Schedule/model/Schedule.slice";
import {modalReducer} from "@/widgets/Modal/model/Modal.slice";
import {authModuleReducer} from "@/widgets/AuthModule/model/AuthModal.slice";
import {userDataReducer} from "@/shared/ui-kit/SpecialClientComponents/model/UserData.slice";

export const store = configureStore({
    reducer: {
        authModule: authModuleReducer,
        sidebar: sidebarReducer,
        schedule: scheduleReducer,
        modal: modalReducer,
        userData: userDataReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch ;