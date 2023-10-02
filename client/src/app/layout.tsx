import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {Body, Div, ProvidersWrapper} from "@/shared";
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
            {
                <ProvidersWrapper>
                    <LayoutWrapper>
                        <Body
                            className={inter.className}
                        >
                            {children}
                            <Div
                                id={"portal"}
                            />
                        </Body>
                        <ModalWindow/>
                    </LayoutWrapper>
                </ProvidersWrapper>
            }
        </html>
    )
}
