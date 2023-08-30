import {DetailedHTMLProps, FC, HTMLAttributes, RefObject} from "react";
import {Identifier} from "dnd-core";

interface ListElementProps extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement>{
    reference?: RefObject<HTMLLIElement> | null
    dataHandlerId?: Identifier | null
}

const ListElement: FC<ListElementProps> = ({
    children,
    className,
    reference,
    dataHandlerId,
    ...otherProps
}) => {
    return (
        <li
            ref={reference}
            className={className}
            data-handler-id={dataHandlerId}
            {...otherProps}
        >
            {children}
        </li>
    );
};

export {ListElement};