import {ButtonHTMLAttributes, DetailedHTMLProps, FC} from "react";

interface HeaderProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{}

const Button: FC<HeaderProps> = ({
        children,
        ...otherProps
}) => {

    return (
        <button
            {...otherProps}
        >
            {
                children
            }
        </button>
    );

};

export {Button};