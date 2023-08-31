import {Button, Div, Text} from "@/shared";

const FolderEditPopUp = () => {
    return (
        <Div
            className={`overflow-hidden absolute z-[2] right-0 bottom-[-105%] min-w-[20%] h-[100%] bg-white transition duration-500`}
        >
            <Button
                onClick={()=>{

                }}
                className={"z-[1] top-3 right-3 p-[12px]"}
            >
                <Text
                    tag={"p"}
                    className={"text-[#79b7bd] text-[16px]"}
                >
                    Изменить имя папки?
                </Text>
            </Button>
        </Div>
    );
};

export {FolderEditPopUp};