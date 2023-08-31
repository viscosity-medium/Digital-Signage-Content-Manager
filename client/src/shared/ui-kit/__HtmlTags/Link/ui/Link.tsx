import NextLink from "next/link";
import React, {DetailedHTMLProps, FC, HTMLAttributes} from "react";

export interface LinkProps extends DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>{
    href: string
    linkType: "internal" | "external"
}

const Link: FC<LinkProps> = ({
    linkType = "internal",
    href,
    children,
    ...otherProps
}) => {

    if(linkType === "internal"){
        return (
            <NextLink
                href={href}
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