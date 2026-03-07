"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function AppContent({ children }) {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith("/dashboard");

    return (
        <>
            {!isDashboard && <Navbar />}
            <main className="flex-1">{children}</main>
            {!isDashboard && <Footer />}
        </>
    );
}
