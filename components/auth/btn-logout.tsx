"use client";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

import { ReactNode } from "react";

interface BtnLogoutProps {
    className?: string;
    children?: ReactNode;
}

export default function BtnLogout({ children,className }: BtnLogoutProps) {
    const handleClick = async () => {
        await signOut({
            callbackUrl: "/login",
        });
    };
    return (
        <Button className={className} onClick={() => handleClick()}>
            {children ? children : "Logout"}
        </Button>
    );
}
