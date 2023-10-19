'use client'

import {DetailedHTMLProps, DialogHTMLAttributes, FC, useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {ModalContainer} from "@/widgets/Modal/ui/content/ModalContainer";
import {ModalContent} from "@/widgets/Modal/ui/content/ModalContent";
import {useSelector} from "react-redux";
import {getModalContent, getModalState} from "@/widgets/Modal/model/Modal.selectors";

export interface ModalWindowProps extends DetailedHTMLProps<DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement> {}

const ModalWindow: FC<ModalWindowProps> = ({

}) => {

    const [portal, setPortal] = useState<HTMLElement| null>(null);
    const isModalShown = useSelector(getModalState);
    const modalContent = useSelector(getModalContent);

    useEffect(() => {
        if(typeof window.document !== undefined){
            setPortal(document.getElementById("portal"));
        }
    }, []);

    if(portal && isModalShown){
        return (
            createPortal(
                <ModalContainer
                >
                    <ModalContent
                        modalContent={modalContent}
                    />
                </ModalContainer>,
                portal
            )
        );
    } else {
        return null;
    }


};

export {ModalWindow};