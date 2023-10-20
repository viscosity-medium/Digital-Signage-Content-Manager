"use client"

import {Button, Div, Main, UserDataWrapper} from "@/shared";
import {AsyncAuthModal, AsyncSchedule, AsyncSidebar} from "@/widgets";
import {useSelector} from "react-redux";
import {getUserLogin, getUserPassWord, resetUserCredentials} from "@/entities";
import {useAppDispatch} from "@/store/store";
import {checkUserCredentials} from "@/entities/user/model/User.helpers";

export default function Home() {

    const login = useSelector(getUserLogin);
    const password = useSelector(getUserPassWord);
    const userCredentials = checkUserCredentials({login, password});
    const dispatch = useAppDispatch();

    return (
        <Main className={"flex w-full h-[100vh] bg-[#79b7bd]"}>
            {
                <UserDataWrapper>
                    {
                        (userCredentials) ?
                            <>
                                <Div className={"overflow-hidden flex w-[70%]"}>
                                    <AsyncSchedule/>
                                </Div>
                                <Div className={"overflow-hidden flex w-[30%] border-l-[4px] border-[#fff]"}>
                                    <AsyncSidebar/>
                                </Div>
                                <Button
                                    className={"absolute bottom-0 left-[50px] py-[4px] px-[12px] text-white border-[3px] rounded duration-300 hover:bg-[#00000033]"}
                                    onClick={ () => {
                                        resetUserCredentials({dispatch})
                                    }}
                                >
                                    Выйти из учётной записи
                                </Button>
                            </> :
                            <AsyncAuthModal/>
                    }
                </UserDataWrapper>
            }
        </Main>
    );


};
