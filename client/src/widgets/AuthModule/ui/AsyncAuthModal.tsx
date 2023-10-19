'use client';

import dynamic from "next/dynamic";

export const AsyncAuthModal = dynamic(() => import('./AuthModal'), { loading: () => <b className={"text-white"}>Loading...</b> });