'use client'

import {Div, Main} from "@/shared";
import {AuthModal, Schedule, Sidebar} from "@/widgets";
import {useSetLocalStorageCredentials} from "@/hooks/localStorageSetters.hook";

export default function Home() {

    const { login, password } = useSetLocalStorageCredentials();

    return (
        <Main className={"flex w-full h-[100vh] bg-[#79b7bd]"}>
            {
                (login === "MaerAdmin" && password === "SuperAdmin010") ?
                <>
                    <Div className={"overflow-hidden flex w-[70%]"}>
                        <Schedule/>
                    </Div>
                    <Div className={"overflow-hidden flex w-[30%] border-l-[4px] border-[#fff]"}>
                        <Sidebar/>
                    </Div>
                </> :
                <AuthModal/>
             }
        </Main>
    );


};
