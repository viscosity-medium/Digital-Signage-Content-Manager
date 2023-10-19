import {defineHtmlTextTag, HtmlTextTagProps} from "../model/helpers";
import {FC} from "react";

const Text: FC<HtmlTextTagProps> = (props) => {

    const textTag = defineHtmlTextTag(props)

    return (
        <>
            {
                textTag
            }
        </>
    );
};

export {Text};