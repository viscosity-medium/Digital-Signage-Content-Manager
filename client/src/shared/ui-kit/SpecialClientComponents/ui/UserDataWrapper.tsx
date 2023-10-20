'use client'

import {ReactNode} from "react"
import {useSetUserCredentials} from "@/entities";

export const UserDataWrapper = (
    {children}:
    {children?: ReactNode}
) => {

    useSetUserCredentials();

    return(
        <>
            {
                children
            }
        </>
    );

}