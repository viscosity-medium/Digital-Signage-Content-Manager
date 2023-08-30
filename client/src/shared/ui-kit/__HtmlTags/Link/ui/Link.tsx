import NextLink from "next/link";
import React, {DetailedHTMLProps, FC, HTMLAttributes} from "react";

export interface LinkProps extends DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>{
    linkType: "internal" | "external"
}

const Link: FC<LinkProps> = ({
    linkType = "internal",
    children,
    ...otherProps
}) => {

    if(linkType === "internal"){
        return (
            <NextLink
                {...otherProps}
            >
                {
                    children
                }
            </NextLink>
        );
    } else {
        return (
            <a
                {...otherProps}
            >
                {
                    children
                }
            </a>
        )
    }

};

export {Link};