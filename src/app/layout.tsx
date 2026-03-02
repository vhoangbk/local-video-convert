import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/store/provider";

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
        <ReduxProvider>
          {children}
        </ReduxProvider>

        <script src="/js/blob-utils.js" defer />
        <script src="https://www.convertsdk.com/sdk/cmd.js" defer />
        <script src="/js/bee-api.js" defer />

      </body>
    </html>
  );
}
