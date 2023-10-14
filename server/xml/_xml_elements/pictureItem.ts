import {MediaContentItemProps} from "../../types/xml.types";

export const pictureItem = ({
    relativeMmsMediaPoolFilePath,
    dateLimits,
    timeDuration,
}: MediaContentItemProps) => {
    return(
    `   <TPictureItem>
            <Date></Date>
            <DisplayTime>${timeDuration ? timeDuration : -1}</DisplayTime>
            ${dateLimits.lowerLimit ?
                (`<MinDate>${dateLimits.lowerLimit}</MinDate>`) : ("")
            }
                    ${dateLimits.upperLimit ?
                (`<MaxDate>${dateLimits.upperLimit}</MaxDate>`) : ("")
            }
            <Log>True</Log>
            <Effect.TransitionNr>0</Effect.TransitionNr>
            <Effect.TransitionParam>1</Effect.TransitionParam>
            <FileName>
                '${relativeMmsMediaPoolFilePath}'
            </FileName>
            ${
                timeDuration ?
                    (`
                            <FilmEnd>${timeDuration}</FilmEnd>
                            <FilmLen>${timeDuration}</FilmLen>
                        `) :
                    ("")
            }
        </TPictureItem>
    `
    )
}