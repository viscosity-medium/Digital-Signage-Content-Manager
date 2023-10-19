import {DetailedHTMLProps, FC, HTMLAttributes} from "react";

interface HeaderProps extends  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>{}

const Header: FC<HeaderProps> = ({
        children,
        className="",
        ...otherProps
}) => {

    return (
        <header
            className={`flex w-full h-[146px] ${className}`}
            {...otherProps}
        >
            {
                children
            }
        </header>
    );

};

export {Header};