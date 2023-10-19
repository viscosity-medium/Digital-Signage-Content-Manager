
export const dateWithoutTimezone = (date: Date) => {

    const timeZoneOffset = date.getTimezoneOffset() * 60000;
    return  new Date(date.valueOf() - timeZoneOffset)
    .toISOString()
    .slice(0, -1);

};