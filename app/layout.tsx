import { PropsWithChildren } from "react";
import "./index.css";

export default function RootLayout({ children }: PropsWithChildren<unknown>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>{children}</body>
        </html>
    );
}
