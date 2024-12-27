
import Navbar from "@/components/navbar";
import { SessionProvider } from "next-auth/react";

export default function LoggedInLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col h-screen w-screen">
            <SessionProvider >
                <Navbar />
                {children}
            </SessionProvider>
        </div>
    )


}