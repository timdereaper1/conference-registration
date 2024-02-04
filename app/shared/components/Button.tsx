/* eslint-disable react/prop-types */
import { clsx } from "clsx";
import React from "react";

export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={clsx("rounded bg-primary px-4 py-2 text-sm text-white", props.className)}
        />
    );
}
