/* eslint-disable react/prop-types */
import clsx from "clsx";
import React from "react";

export default function TextField({
    label,
    inline,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    inline?: boolean;
}) {
    return (
        <label
            htmlFor={props.name}
            className={clsx(
                "group/textfield block flex-1 text-sm font-normal text-dark data-[inline=true]:flex data-[inline=true]:items-center data-[inline=true]:gap-2",
                props.className,
            )}
            data-inline={inline}
        >
            <span className="block pb-2 group-data-[inline=true]/textfield:pb-0">
                {label}
                {props.required ? "*" : null}
            </span>
            <input
                {...props}
                id={props.name}
                className="w-full rounded border border-solid border-primary-50 p-2 outline-none placeholder:text-dark-50 focus:border-primary group-data-[inline=true]/textfield:py-1"
            />
        </label>
    );
}
