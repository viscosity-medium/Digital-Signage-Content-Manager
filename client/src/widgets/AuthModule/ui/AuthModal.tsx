import {Button, Div, Form, Input, Text} from "@/shared";
import {
    onLoginInputChange,
    onPasswordInputChange,
    onSubmitButtonClick
} from "@/widgets/AuthModule/model/AuthModal.helpers";
import {useAppDispatch} from "@/store/store";
import {useSelector} from "react-redux";
import {getAuthModuleLogin, getAuthModulePassword} from "@/widgets/AuthModule/model/AuthModal.selectors";


const AuthModal = () => {

    const dispatch = useAppDispatch();
    const login = useSelector(getAuthModuleLogin);
    const password = useSelector(getAuthModulePassword);

    return (
        <Form
            className={"absolute flex flex-col items-center  p-[20px] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] border-[#fff] border-[2px]"}
        >
            <Text
                tag={"h1"}
                className={"text-[24px] text-[#fff]"}
            >
                Введите данные учётной записи
            </Text>
            <Div
                className={"flex flex-col items-center mt-[12px]"}
            >
                <Div
                    className={"flex"}
                >
                    <Text
                        tag={"p"}
                        className={"w-[70px] text-[#fff]"}
                    >
                        Логин
                    </Text>
                    <Input
                        type={"text"}
                        className={"px-2 outline-none"}
                        value={login}
                        onChange={(event) => {
                            onLoginInputChange({event, dispatch})
                        }}
                    />
                </Div>
                <Div
                    className={"flex mt-[8px]"}
                >
                    <Text
                        tag={"p"}
                        className={"w-[70px] text-[#fff]"}
                    >
                        Пароль
                    </Text>
                    <Input
                        type={"password"}
                        className={"px-2 outline-none"}
                        value={password}
                        onChange={(event) => {
                            onPasswordInputChange({event, dispatch})
                        }}
                    />
                </Div>
            </Div>
            <Button
                className={"mt-[20px] p-[8px] w-[50%] border-[#fff] border-[2px] border-solid duration-300 hover:bg-[#00000033]"}
                type={"submit"}
                onClick={(event) => {
                    onSubmitButtonClick({
                        login,
                        password
                    })
                }}
            >
                <Text
                    tag={"p"}
                    className={"text-[#fff]"}
                >
                    Войти
                </Text>
            </Button>
        </Form>
    );

};

export {AuthModal};