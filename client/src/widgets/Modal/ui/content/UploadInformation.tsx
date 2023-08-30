import {Button, Text} from "@/shared";
import {modalActions} from "@/widgets/Modal/model/Modal.slice";
import {useAppDispatch} from "../../../../../store/store";

const UploadInformation = () => {

    const dispatch = useAppDispatch();

    return (
        <>
        <Text
            tag={"h2"}
            className={"text-[20px]"}
        >
            Вы успешно сохранили расписание в системе EaseScreen
        </Text>
        <Button
            onClick={()=>{
                dispatch(modalActions.setModalIsShown());
            }}
            className={"mt-[20px] px-[20px] py-[8px] border-[2px] border-solid border-[#000] rounded-[16px]"}
        >
            Закрыть модальное окно
        </Button>
        </>
    );
};

export {UploadInformation};