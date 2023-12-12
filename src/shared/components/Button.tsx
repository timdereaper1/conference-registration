import { clsx } from "clsx";
import { PropsWithChildren } from "react";

export default function Button({
    children,
    type = "button",
    className,
}: PropsWithChildren<{
    type?: "submit" | "button";
    className?: string;
}>) {
    return (
        <button
            className={clsx("rounded bg-primary px-4 py-2 text-sm text-white", className)}
            type={type}
        >
            {children}
        </button>
    );
}
