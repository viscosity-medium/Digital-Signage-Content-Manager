import {ComputeRange} from "./types";

// black-picture_[turn-off-screen] xml
export type Hours24 = 24;
export type Minutes60 = 60;
export type Hours24Range = ComputeRange<Hours24>[number]
export type Minutes60Range = ComputeRange<Minutes60>[number]

export interface DateTime {
    hours24: Hours24Range,
    minutes60: Minutes60Range
}

export interface BlackPictureProps {
    dateTime: DateTime
    contentDurationTime: DateTime
}

