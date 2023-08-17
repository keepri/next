import "~/styles/globals.css";

import { type PropsWithChildren } from "react";
import { Inter } from "next/font/google";
import ClientProviders from "~/components/ClientProviders";
import { type Metadata } from "next/types";

const inter = Inter({
    subsets: ["latin"],
    preload: true,
});

export const metadata: Metadata = {
    title: "change me",
    description: "also me",
};

export default function RootLayout(props: PropsWithChildren): JSX.Element {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ClientProviders>
                    {props.children}
                </ClientProviders>
            </body>
        </html>
    );
}
