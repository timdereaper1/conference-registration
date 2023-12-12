import clsx from "clsx";
import React, { PropsWithChildren } from "react";

export default function SelectField({
    onChange,
    name,
    label,
    value,
    required,
    error,
    children,
    inline,
    className,
}: PropsWithChildren<{
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    name?: string;
    label: string;
    value: string | number;
    required?: boolean;
    error?: string;
    inline?: boolean;
    className?: string;
}>) {
    return (
        <label
            data-inline={inline}
            htmlFor={name}
            className={clsx(
                "group/selectField block flex-1 text-sm font-normal text-dark data-[inline=true]:flex data-[inline=true]:items-center data-[inline=true]:gap-2",
                className,
            )}
        >
            <span className="block pb-2 group-data-[inline=true]/selectField:pb-0">
                {label}
                {required ? "*" : null}
            </span>
            <select
                onChange={onChange}
                name={name}
                id={name}
                required={required}
                value={value}
                className="w-full rounded border border-solid border-primary-50 px-2 py-2 text-xs outline-none placeholder:text-dark-50 focus:border-primary group-data-[inline=true]/selectField:py-1"
            >
                {children}
            </select>
            {error ? <small>{error}</small> : null}
        </label>
    );
}
