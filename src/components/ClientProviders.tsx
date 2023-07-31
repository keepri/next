"use client";

import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import { enableReactUse } from "@legendapp/state/config/enableReactUse";
enableReactUse();
enableReactComponents();

import { type PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";

export default function ClientProviders(props: PropsWithChildren): JSX.Element {
    return <SessionProvider>{props.children}</SessionProvider>;
}

