import {DetailedHTMLProps, FC, HTMLAttributes, RefObject} from "react";

interface UnorderedListProps extends DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>{
    reference?: RefObject<HTMLUListElement> | any
}

const UnorderedList: FC<UnorderedListProps> = ({
    children,
    className,
    reference,
    ...otherProps
}) => {

    return (
        <ul
            ref={reference}
            className={`${className}`}
            {...otherProps}
        >
            {children}
        </ul>
    );

};

export {UnorderedList};