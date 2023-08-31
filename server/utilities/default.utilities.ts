export const modifySingleLengthValue = (value: number) => {
    if(`${value}`.length < 2){
        return `0${value}`
    } else {
        return `${value}`
    }
}