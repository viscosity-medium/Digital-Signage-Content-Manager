import {DetailedHTMLProps, FC, HTMLAttributes} from "react";
export interface MainProps extends  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>{};

const Main: FC<MainProps> = ({
    children,
    className="",
    ...otherProps
}) => {
    
    return (
        <main
            className={`relative ${className}`}
            {
                ...otherProps
            }
        >
            {
                children
            }
        </main>
    );
};

export {Main};