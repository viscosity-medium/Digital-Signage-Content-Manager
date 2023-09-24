
export interface VideoItemProps {
    relativeMmsMediaPoolFilePath: string
    timeDuration?: number | undefined
    dateLimits: {
        lowerLimit: number | undefined
        upperLimit: number | undefined
    },
}

export const videoItem = ({
    relativeMmsMediaPoolFilePath,
    dateLimits,
    timeDuration
}: VideoItemProps) => {

    return(
    `   <TMovieItem>
            <Date></Date>
            <DisplayTime>-1</DisplayTime>
            ${dateLimits.lowerLimit ?
                (`<MinDate>${dateLimits.lowerLimit}</MinDate>`) : ("")
            }
            ${dateLimits.upperLimit ?
                (`<MaxDate>${dateLimits.upperLimit}</MaxDate>`) : ("")
            }
            <Log>True</Log>
            <Effect.TransitionNr>1</Effect.TransitionNr>
            <Effect.TransitionParam>1</Effect.TransitionParam>
            <Effect.TransitionLength>400</Effect.TransitionLength>
            <Effect.BackColor>clDefault</Effect.BackColor>
            <FileName>
                '${relativeMmsMediaPoolFilePath}'
            </FileName>${
                timeDuration ?
                (`
                    <FilmEnd>${timeDuration}</FilmEnd>
                    <FilmLen>${timeDuration}</FilmLen>
                `) : 
                ("")
            }
        </TMovieItem>
    `
    )

};