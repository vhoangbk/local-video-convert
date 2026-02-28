import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Local Video Converter",
  description: "Convert video with local WebAssembly",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
