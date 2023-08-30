import {DetailedHTMLProps, FC, HTMLAttributes} from "react";

interface NavbarProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{

}

const Navbar: FC<NavbarProps> = ({

}) => {
    return (
        <nav>

        </nav>
    );
};

export {Navbar};