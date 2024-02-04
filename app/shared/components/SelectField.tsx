/* eslint-disable react/prop-types */
import clsx from "clsx";
import React from "react";

export default function SelectField({
    label,
    error,
    inline,
    ...props
}: React.InputHTMLAttributes<HTMLSelectElement> & {
    label: string;
    error?: string;
    inline?: boolean;
}) {
    return (
        <label
            data-inline={inline}
            htmlFor={props.name}
            className={clsx(
                "group/selectField block flex-1 text-sm font-normal text-dark data-[inline=true]:flex data-[inline=true]:items-center data-[inline=true]:gap-2",
                props.className,
            )}
        >
            <span className="block pb-2 group-data-[inline=true]/selectField:pb-0">
                {label}
                {props.required ? "*" : null}
            </span>
            <select
                {...props}
                id={props.name}
                className="w-full rounded border border-solid border-primary-50 p-2 text-xs outline-none placeholder:text-dark-50 focus:border-primary group-data-[inline=true]/selectField:py-1"
            />
            {error ? <small>{error}</small> : null}
        </label>
    );
}
