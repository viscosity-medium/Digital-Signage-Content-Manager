import {BlackPictureProps} from "../../types/xml.types";
import {modifySingleLengthValue} from "../../utilities/default.utilities";

export const blackPicture_TurnOffScreen = ({
    dateTime: {
        hours24: dateTimeHours = 0,
        minutes60: dateTimeMinutes = 30
    },
    contentDurationTime: {
        hours24: contentDurationHours = 0,
        minutes60: contentDurationMinutes = 30
    }
}: BlackPictureProps) => {

    // modified values
    const editedDateTimeHours = modifySingleLengthValue(dateTimeHours);
    const editedDateTimeMinutes = modifySingleLengthValue(dateTimeMinutes);
    const editedContentDurationHours = modifySingleLengthValue(contentDurationHours);
    const editedContentDurationMinutes = modifySingleLengthValue(contentDurationMinutes);

    // data for xml
    const dateParameter = `${editedDateTimeHours}.${editedDateTimeMinutes}`;
    const LengthParameter = `${editedContentDurationHours}.${editedContentDurationMinutes}`;

    return(
`   <TPictureItem>
        <Date>Default ${dateParameter}</Date>
        <Length>${LengthParameter}</Length>
        <Log>True</Log>
        <Effect.TransitionNr>1</Effect.TransitionNr>
        <Effect.TransitionParam>1</Effect.TransitionParam>
        <Effect.TransitionLength>400</Effect.TransitionLength>
        <FileName>'ENKA\\1344x1152\\black.png'</FileName>
    </TPictureItem>`
    )
};