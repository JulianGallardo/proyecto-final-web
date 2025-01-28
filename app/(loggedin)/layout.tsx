
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { SessionProvider } from "next-auth/react";

export default function LoggedInLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex flex-col h-full w-full">
            <SessionProvider >
                <TooltipProvider>
                    <Navbar />
                    {children}
                </TooltipProvider>
            </SessionProvider>
            <Toaster />
        </div>
    )


}