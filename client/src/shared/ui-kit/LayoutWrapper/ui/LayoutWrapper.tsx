'use client'

import {useAppDispatch} from "../../../../../store/store";
import {scheduleActions} from "@/widgets/Schedule/model/Schedule.slice";
import {ReactNode, useEffect} from "react";

const LayoutWrapper = ({children}: {children: ReactNode}) => {

    const dispatch = useAppDispatch();

    const escFunction = () => {
        dispatch(scheduleActions.setActiveItemIndex(undefined))
    }

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    return (
        <>
            {children}
        </>
    );
};

export {LayoutWrapper};