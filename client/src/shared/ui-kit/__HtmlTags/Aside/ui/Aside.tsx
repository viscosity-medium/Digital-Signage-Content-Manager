import {DetailedHTMLProps, FC, HTMLAttributes} from "react";

interface AsideProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>{}

const Aside: FC<AsideProps> = ({
        children,
        ...otherProps
}) => {

    return (
        <aside
            className={""}
            {...otherProps}
        >
            {
                children
            }
        </aside>
    );

};

export {Aside};