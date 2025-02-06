"use client";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { ReactNode } from "react";

interface BtnLogoutProps {
    className?: string;
    children?: ReactNode;
}

export default function BtnLogout({ children,className }: Readonly<BtnLogoutProps>) {
    const handleClick = async () => {
        await signOut({
            redirectTo: new URL("/login", window.location.origin).toString(),
        });
    };
    return (
        <Button className={className} onClick={() => handleClick()}>
            {children || "Logout"}
        </Button>
    );
}
