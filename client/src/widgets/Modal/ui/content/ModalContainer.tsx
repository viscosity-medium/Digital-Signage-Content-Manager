import {Div} from "@/shared";
import {DetailedHTMLProps, DialogHTMLAttributes, FC, ReactNode} from "react";

export interface ModalContainerProps extends DetailedHTMLProps<DialogHTMLAttributes<ReactNode>, ReactNode> {}

const ModalContainer: FC<ModalContainerProps> = ({
    children,
    className,
    ...otherProps
}) => {
    return (
        <Div
            className={`absolute z-[10] top-0 left-0 flex justify-center items-center w-[100vw] h-[100vh] bg-[#00000099] ${className}`}
        >
            <Div
                className={"flex flex-col justify-center items-center p-[32px] max-w-[80%] min-w-[40%] max-h-[60%] min-h-[10%] bg-white rounded-[25px]"}
            >
                {
                    children
                }
            </Div>

        </Div>
    );
};

export {ModalContainer};