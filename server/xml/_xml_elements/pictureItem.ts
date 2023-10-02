import {VideoItemProps} from "../../types/xml.types";

export const pictureItem = ({
    relativeMmsMediaPoolFilePath,
    dateLimits,
    timeDuration
}: VideoItemProps) => {
    return(
    `   <TPictureItem>
            <Date></Date>
            <Log>True</Log>
            <Effect.TransitionNr>0</Effect.TransitionNr>
            <Effect.TransitionParam>1</Effect.TransitionParam>
            <FileName>
                '${relativeMmsMediaPoolFilePath}'
            </FileName>
        </TPictureItem>
    `
    )
}