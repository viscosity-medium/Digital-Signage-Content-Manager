import {blackPicture_TurnOffScreen} from "./black-picture_[turn-off-screen]";
import {daySchedule} from "./day-schedule";
import {nightSchedule} from "./night-schedule";

export const xmlBase = () => {

    const blackScreen1 = blackPicture_TurnOffScreen({
        dateTime: {
            hours24: 0,
            minutes60: 0
        },
        contentDurationTime: {
            hours24: 8,
            minutes60: 0
        }
    });

    const blackScreen2 = blackPicture_TurnOffScreen({
        dateTime: {
            hours24: 22,
            minutes60: 0
        },
        contentDurationTime: {
            hours24: 1,
            minutes60: 50
        }
    });

    const daySchedule1 = daySchedule({content: ""});

    const nightSchedule1 = nightSchedule({content: ""});

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

console.log(xmlBase())