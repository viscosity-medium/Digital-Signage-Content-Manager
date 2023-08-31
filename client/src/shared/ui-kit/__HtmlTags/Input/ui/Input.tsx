import {DetailedHTMLProps, FC, InputHTMLAttributes} from "react";

export interface InputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>{

}

const Input: FC<InputProps> = ({
    children,
    ...otherProps
}) => {
    return (
        <input
            {...otherProps}
        >
            {
                children
            }
        </input>
    );
};

export {Input};