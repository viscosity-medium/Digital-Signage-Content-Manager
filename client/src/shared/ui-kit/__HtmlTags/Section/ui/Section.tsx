import {DetailedHTMLProps, FC, HTMLAttributes} from "react";

export interface SectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>{}

const Section: FC<SectionProps> = (
    {
        children,
        ...otherProps
    }
) => {
    return (
        <section
            className={"bg-white"}
            {...otherProps}
        >
            
        </section>
    );
};

export {Section};