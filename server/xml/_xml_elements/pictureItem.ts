
export const pictureItem = (filePath) => {
    return(
    `   <TPictureItem>
            <Date></Date>
            <Log>True</Log>
            <Effect.TransitionNr>0</Effect.TransitionNr>
            <Effect.TransitionParam>1</Effect.TransitionParam>
            <FileName>
                ${filePath}
            </FileName>
        </TPictureItem>
    `
    )
}