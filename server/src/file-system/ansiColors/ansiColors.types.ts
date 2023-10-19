export type AnsiColorsTypes = "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white";

export type AnsiColors = Record<AnsiColorsTypes, string>;
export type PartialAnsiColors = Partial<Record<AnsiColorsTypes, string[]>>;