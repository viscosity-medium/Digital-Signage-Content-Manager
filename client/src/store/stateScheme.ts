import {SidebarScheme} from "@/widgets/Sidebar/model/Sidebar.type";

import {ScheduleScheme} from "@/widgets/Schedule/model/Schedule.types";
import {ModalSchema} from "@/widgets/Modal/model/Modal.slice";
import {AuthModuleScheme} from "@/widgets/AuthModule/model/AuthModal.slice";
import {UserDataSchema} from "@/entities/user/model/UserData.slice";


export interface StateScheme {
    sidebar: SidebarScheme
    schedule: ScheduleScheme
    modal: ModalSchema
    authModule: AuthModuleScheme
    userData: UserDataSchema
}