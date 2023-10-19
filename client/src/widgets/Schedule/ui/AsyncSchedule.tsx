'use client';

import dynamic from "next/dynamic";

export const AsyncSchedule = dynamic(() => import('./Schedule'), { loading: () => <b className={"text-white"}>Loading...</b> });