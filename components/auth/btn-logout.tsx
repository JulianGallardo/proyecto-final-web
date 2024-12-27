"use client";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export default  function BtnLogout() {
    const handleClick = async () => {
        await signOut(
            {
                callbackUrl: "/signin",
            }
        );
    }
    return (
        <Button onClick={() => handleClick()}>Logout</Button>
    );
}