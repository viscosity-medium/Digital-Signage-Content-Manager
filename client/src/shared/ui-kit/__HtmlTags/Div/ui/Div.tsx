import {DetailedHTMLProps, FC, HTMLAttributes, RefObject} from "react";

interface DivProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    reference?: RefObject<HTMLDivElement>
}

const Div: FC<DivProps> = ({
        children,
        className,
        reference,
        ...otherProps
}) => {

    return (
        <div
            className={className}
            ref={reference}
            {...otherProps}
        >
            {
                children
            }
        </div>
    );

};

export {Div};