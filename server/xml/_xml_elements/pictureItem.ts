import {VideoItemProps} from "../../types/xml.types";

export const pictureItem = ({
    relativeMmsMediaPoolFilePath,
    dateLimits,
    timeDuration
}: VideoItemProps) => {
    return(
    `   <TPictureItem>
            <Date></Date>
            <DisplayTime>${timeDuration ? timeDuration : -1}</DisplayTime>
            <Log>True</Log>
            ${dateLimits.lowerLimit ?
                (`<MinDate>${dateLimits.lowerLimit}</MinDate>`) : ("")
            }
                    ${dateLimits.upperLimit ?
                (`<MaxDate>${dateLimits.upperLimit}</MaxDate>`) : ("")
            }
            <Effect.TransitionNr>0</Effect.TransitionNr>
            <Effect.TransitionParam>1</Effect.TransitionParam>
            <FileName>
                '${relativeMmsMediaPoolFilePath}'
            </FileName>
        </TPictureItem>
    `
    )
}