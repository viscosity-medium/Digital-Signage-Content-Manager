
export const getFoldersElementsColors = ({condition}: {condition: boolean}) => {
    const folderBackgroundColor = condition ? "activeBackgroundColor" : "folderBackgroundColor";
    const folderBorderColor = condition ? "activeBorderColor" : "folderBorderColor";
    const textColor = condition ? "whiteTextColor" : "blueTextColor";

    return {
        textColor,
        folderBorderColor,
        folderBackgroundColor
    }
};

export const getFileElementsColors = ({condition}: {condition: boolean}) => {
    const fileBackgroundColor = condition ? "activeBackgroundColor" : "whiteBackgroundColor";
    const fileColorLight = condition ? "activeBorderColor" : "whiteBorderColor";
    const textColor = condition ? "whiteTextColor" : "blueTextColor";

    return {
        textColor,
        fileColorLight,
        fileBackgroundColor
    }
}