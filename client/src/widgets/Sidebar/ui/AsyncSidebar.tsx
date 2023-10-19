'use client';

import dynamic from "next/dynamic";

export const AsyncSidebar = dynamic(() => import('./Sidebar'), { loading: () => <b className={"text-white"}>Loading...</b> });