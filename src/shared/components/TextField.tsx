import clsx from "clsx";
import React from "react";

export default function TextField({
    label,
    name,
    onChange,
    value,
    required,
    placeholder,
    type = "text",
    min,
    inline,
    className,
}: {
    placeholder?: string;
    label: string;
    value: string | number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    required?: boolean;
    type?: "text" | "number" | "email";
    min?: number;
    inline?: boolean;
    className?: string;
}) {
    return (
        <label
            htmlFor={name}
            className={clsx(
                "group/textfield block flex-1 text-sm font-normal text-dark data-[inline=true]:flex data-[inline=true]:items-center data-[inline=true]:gap-2",
                className,
            )}
            data-inline={inline}
        >
            <span className="block pb-2 group-data-[inline=true]/textfield:pb-0">
                {label}
                {required ? "*" : null}
            </span>
            <input
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                type={type}
                name={name}
                id={name}
                required={required}
                className="w-full rounded border border-solid border-primary-50 p-2 outline-none placeholder:text-dark-50 focus:border-primary group-data-[inline=true]/textfield:py-1"
                min={min}
            />
        </label>
    );
}
