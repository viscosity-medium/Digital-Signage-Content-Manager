
export interface VideoItemProps {
    relativeMmsMediaPoolFilePath: string
    fileDuration?: string
    dateLimits: {
        lowerLimit: number | undefined
        upperLimit: number | undefined
    },
}

export const videoItem = ({
    relativeMmsMediaPoolFilePath,
    dateLimits,
    fileDuration
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
                (fileDuration && fileDuration !== "default") ?
                (`
                    <FilmEnd>${fileDuration}</FilmEnd>
                    <FilmLen>${fileDuration}</FilmLen>
                `) : 
                ("")
            }
        </TMovieItem>
    `
    )

};