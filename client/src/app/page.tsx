'use client'

import {Div, Main} from "@/shared";
import {Sidebar, Schedule, AuthModal} from "@/widgets";

export default function Home() {

    const login = localStorage.getItem("login");
    const password = localStorage.getItem("password");

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
