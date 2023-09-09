
import {daySchedule} from "./daySchedule";
import {nightSchedule} from "./nightSchedule";
import {blackScreen1, blackScreen2} from "./blackPicture";

export const xmlBase = (day, night) => {

    const daySchedule1 = daySchedule(day);
    const nightSchedule1 = nightSchedule(night);

    return(
`<?xml version="1.0" encoding="iso-8859-15" standalone="yes" ?>
<easescreen type="day">
    ${nightSchedule1}
    ${blackScreen1}
    ${blackScreen2}
    ${daySchedule1}
</easescreen>
`
    )
}
