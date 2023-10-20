'use client'

import {useCallback, useRef} from "react";

export const useDebounce = ({
    callback,
    timeout
}: {
    callback: (...args: any[]) => void,
    timeout: number
}) => {
    const timer = useRef<NodeJS.Timeout | null>(null);

    return useCallback((...args: any[]) => {

        if(timer.current){
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(()=>{
            callback(args);
        }, timeout);

    },[callback, timeout]);

}