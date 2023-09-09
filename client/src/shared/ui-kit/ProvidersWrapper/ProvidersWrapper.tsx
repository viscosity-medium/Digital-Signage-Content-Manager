"use client"

import { FC, ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../../../../store/store";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

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