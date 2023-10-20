import {useSelector} from "react-redux";
import {getUserLogin, getUserPassWord} from "@/entities";
import {checkUserCredentials} from "@/entities/user/model/User.helpers";
import {Button, Div, Text} from "@/shared";
import {onDeployButtonClick, onSaveButtonClick} from "../../../model/helpers/ScheduleEventListeners.helpers";
import {useAppDispatch} from "@/store/store";
import {getScheduleStructure} from "../../../model/Schedule.selectors";

const DeployBar = () => {

    const dispatch = useAppDispatch();
    const scheduleStructure = useSelector(getScheduleStructure);
    const login = useSelector(getUserLogin);
    const password = useSelector(getUserPassWord);
    const userCredentials = checkUserCredentials({login, password});

    if(userCredentials === "digisky") {
        return (
            <Div
                className={"flex justify-between mt-[0] w-[100%]"}
            >
                <Button
                    className={"w-[70%] border-[3px] border-white rounded transition duration-300 hover:bg-[#00000033]"}
                    onClick={async ()=>{
                        await onSaveButtonClick(dispatch, scheduleStructure);
                    }}
                >
                    <Text
                        tag={"p"}
                        className={"py-[4px] px-[8px] text-[#fff] text-[20px]"}
                    >
                        Сохранить расписание
                    </Text>
                </Button>
                <Button
                    className={"w-[25%] border-[3px] border-[#65ff94] rounded transition duration-300 hover:bg-[#00000033]"}
                    onClick={async ()=>{
                        await onDeployButtonClick(dispatch, scheduleStructure);
                    }}
                >
                    <Text
                        tag={"p"}
                        className={"py-[4px] px-[8px] text-[#65ff94] text-[20px]"}
                    >
                        Загрузить на плееры
                    </Text>
                </Button>
            </Div>
        )
    } else if(userCredentials === "maer") {
        return (
            <Button
                className={"w-[100%] border-[3px] border-white rounded transition duration-300 hover:bg-[#00000033]"}
                onClick={async ()=>{
                    await onSaveButtonClick(dispatch, scheduleStructure);
                }}
            >
                <Text
                    tag={"p"}
                    className={"py-[4px] px-[8px] text-[#fff] text-[20px]"}
                >
                    Сохранить расписание
                </Text>
            </Button>
        )
    }
};

export {DeployBar};