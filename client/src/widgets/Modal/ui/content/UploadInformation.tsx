import {FC} from "react";
import {Button, Text} from "@/shared";
import {modalActions} from "@/widgets/Modal/model/Modal.slice";
import {useAppDispatch} from "@/store/store";
import {UploadInformationProps} from "@/widgets/Modal/model/Modal.types";

const UploadInformation: FC<UploadInformationProps> = ({modalContent}) => {

    const dispatch = useAppDispatch();

    return (
        <>
            {
                !modalContent.error ? (
                    <Text
                        tag={"h2"}
                        className={"text-[20px]"}
                    >
                        {
                            modalContent.response
                        }
                    </Text>
                ) : (
                    <Text
                        tag={"h2"}
                        className={"text-[20px] text-red-500"}
                    >
                        {
                            modalContent.error
                        }
                    </Text>
                )
            }
        <Button
            onClick={()=>{
                dispatch(modalActions.setModalIsShown(false));
            }}
            className={"mt-[20px] px-[20px] py-[8px] border-[2px] border-solid border-[#000] rounded-[16px]"}
        >
            Закрыть модальное окно
        </Button>
        </>
    );

};

export {UploadInformation};