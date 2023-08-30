'use client'

import {Div, Main} from "@/shared";
import {Sidebar, Schedule} from "@/widgets";

export default function Home() {

    return (
        <Main className={"flex w-full h-[100vh] bg-[#79b7bd]"}>
            <Div className={"flex w-[70%]"}>
                <Schedule/>
            </Div>
            <Div className={"w-[30%] border-l-[4px]"}>
                <Sidebar/>
            </Div>
        </Main>
    )

}
