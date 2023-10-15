'use client'

import {ReactNode} from "react"
import {useSetUserCredentials} from "@/hooks/user.hook";

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