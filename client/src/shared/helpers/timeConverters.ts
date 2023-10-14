
export const dateWithoutTimezone = (date: Date) => {
    console.log(date)
    const timeZoneOffset = date.getTimezoneOffset() * 60000;
    const resultTime = new Date(date.valueOf() - timeZoneOffset)
    .toISOString()
    .slice(0, -1);

    console.log(new Date(date.valueOf() - timeZoneOffset));
    return resultTime;
};