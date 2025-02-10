
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";

export default function LoggedInLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex flex-col h-full w-full">
            <SessionProvider >
                <TooltipProvider delayDuration={0}>
                    <Navbar />
                    {children}
                </TooltipProvider>
            </SessionProvider>
            <Toaster />
        </div>
    )


}