
export const nightSchedule = ({content}) => {
    return(
`   <TMultiItem>
        <Date>Default 20.00</Date>
        <Length>02.00</Length>
        <Comment>'Night'</Comment>
        <Effect.TransitionNr>0</Effect.TransitionNr>
        <DefaultTime>15</DefaultTime>
        <Items>
            ${content}
        </Items>
    </TMultiItem>`
    )
}