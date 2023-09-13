
export const videoItem = (filePath) => {

    return(
    `   <TMovieItem>
            <Date></Date>
            <DisplayTime>-1</DisplayTime>
            <Log>True</Log>
            <Effect.TransitionNr>1</Effect.TransitionNr>
            <Effect.TransitionParam>1</Effect.TransitionParam>
            <Effect.TransitionLength>400</Effect.TransitionLength>
            <Effect.BackColor>clDefault</Effect.BackColor>
            <FileName>
                ${filePath}
            </FileName>
        </TMovieItem>
    `
    )

};