import {DetailedHTMLProps, FC, InputHTMLAttributes} from "react";

export interface InputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>{}

const Input: FC<InputProps> = ({
    children,
    className,
    ...otherProps

}) => {
    return (
        <input
            className={className}
            {...otherProps}
        >
            {
                children
            }
        </input>
    );
};

export {Input};