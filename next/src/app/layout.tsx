import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

interface RootProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootProps>) {
    return (
        <html lang="en" className="h-screen">
            <body className="h-screen bg-gray-800">{children}</body>
        </html>
    );
}
