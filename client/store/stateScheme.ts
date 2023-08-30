import {SidebarScheme} from "@/widgets/Sidebar/model/Sidebar.type";

import {ScheduleScheme} from "@/widgets/Schedule/model/Schedule.types";
import {ModalSchema} from "@/widgets/Modal/model/Modal.slice";


export interface StateScheme {
    sidebar: SidebarScheme
    schedule: ScheduleScheme
    modal: ModalSchema
}