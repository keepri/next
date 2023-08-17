"use client";

import { ThemeProvider } from "next-themes";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import { enableReactUse } from "@legendapp/state/config/enableReactUse";
enableReactUse();
enableReactComponents();

import { type PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";

export default function ClientProviders(props: PropsWithChildren): JSX.Element {
    return (
        <SessionProvider>
            {/**                                                   TODO change me */}
            <ThemeProvider attribute="class" defaultTheme="system" forcedTheme="light" enableSystem>
                {props.children}
            </ThemeProvider>
        </SessionProvider>
    );
}

