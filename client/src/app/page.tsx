"use client"

import {Div, Main, UserDataWrapper} from "@/shared";
import {AsyncAuthModal, AsyncSchedule, AsyncSidebar} from "@/widgets";
import {useSelector} from "react-redux";
import {getUserLogin, getUserPassWord} from "@/shared/ui-kit/SpecialClientComponents/model/UserData.selectors";

export default function Home() {

    const login = useSelector(getUserLogin);
    const password = useSelector(getUserPassWord);

    return (
        <Main className={"flex w-full h-[100vh] bg-[#79b7bd]"}>
            {
                <UserDataWrapper>
                    {
                        (login === "MaerAdmin" && password === "SuperAdmin010") ?
                            <>
                                <Div className={"overflow-hidden flex w-[70%]"}>
                                    <AsyncSchedule/>
                                </Div>
                                <Div className={"overflow-hidden flex w-[30%] border-l-[4px] border-[#fff]"}>
                                    <AsyncSidebar/>
                                </Div>
                            </> :
                            <AsyncAuthModal/>
                    }
                </UserDataWrapper>
            }
        </Main>
    );


};
