'use client'

import {useAppDispatch} from "@/store/store";
import {scheduleActions} from "@/widgets/Schedule/model/Schedule.slice";
import {ReactNode, useEffect} from "react";

const LayoutWrapper = ({children}: {children: ReactNode}) => {

    const dispatch = useAppDispatch();


    useEffect(() => {

        const escFunction = (event: KeyboardEvent) => {
            if(event.code === "Escape"){
                dispatch(scheduleActions.setActiveItemIndex(undefined))
            }
        }

        document.addEventListener("keydown", escFunction, false);

        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [dispatch]);

    return (
        <>
            {children}
        </>
    );
};

export {LayoutWrapper};