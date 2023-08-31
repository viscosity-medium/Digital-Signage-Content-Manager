
export const daySchedule = ({content}) => {
    return(
`   <TMultiItem>
        <Date>Default 08.00</Date>
        <Length>12.00</Length>
        <Comment>'Day-1344'</Comment>
        <Effect.TransitionNr>0</Effect.TransitionNr>
        <DefaultTime>15</DefaultTime>
        <Items>
            ${content}
        </Items>
    </TMultiItem>`
    )
}