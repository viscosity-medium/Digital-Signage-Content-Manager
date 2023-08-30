"use client"

import {Provider} from "react-redux";
import {store, useAppDispatch} from "../../../../store/store";
import {FC, ReactNode, useEffect} from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {scheduleActions} from "@/widgets/Schedule/model/Schedule.slice";

export interface ProvidersWrapperProps {
    children: ReactNode
}

const ProvidersWrapper: FC<ProvidersWrapperProps> = ({children}) => {

    return (
        <Provider store={store}>
            <DndProvider backend={HTML5Backend}>
                {
                    children
                }
            </DndProvider>
        </Provider>
    );
};

export {ProvidersWrapper};