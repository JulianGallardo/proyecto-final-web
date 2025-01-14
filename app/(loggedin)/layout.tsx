
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";

export default function LoggedInLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex flex-col h-screen w-screen">
            <SessionProvider >
                <Navbar />
                {children}
            </SessionProvider>
            <Toaster />
        </div>
    )


}