import {DetailedHTMLProps, FC, HTMLAttributes} from "react";

export interface HRProps extends DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement> {

}

const Hr: FC<HRProps> = ({
    className,
    ...otherProps
}) => {
    return (
        <hr
            className={className}
            {...otherProps}
        >

        </hr>
    );
};

export {Hr};