import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {ProvidersWrapper} from "@/shared";
import {ReactNode} from "react";
import {ModalWindow} from "@/widgets/Modal/ui/ModalWindow";
import {LayoutWrapper} from "@/shared/ui-kit/LayoutWrapper/ui/LayoutWrapper";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Easescreen content manager',
  description: 'Easescreen content manager',
}

export default function RootLayout({
    children,
}: {
    children: ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>{
                <ProvidersWrapper>
                    <LayoutWrapper>
                        {children}
                        <div
                            id={"portal"}
                            // className={"w-[100vw] h-[100vh ]"}
                        />
                        <ModalWindow/>
                    </LayoutWrapper>
                </ProvidersWrapper>
            }</body>
        </html>
    )
}
