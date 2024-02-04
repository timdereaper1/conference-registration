import React from "react";

export default function DashboardLayout({ children }: React.PropsWithChildren<unknown>) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <aside
                data-collapse={false}
                className="peer basis-2/12 bg-white shadow-xl data-[collapse=true]:basis-16"
            ></aside>
            <main className="flex h-full flex-1 basis-10/12 flex-col gap-8 peer-data-[collapse]:basis-full">
                <nav className="mx-4 mt-4 flex items-center gap-8 rounded bg-white p-4 shadow-lg">
                    <div className="flex items-center gap-4">
                        <span className="icon-[heroicons--pencil-square-solid] text-lg text-dark"></span>
                        <span className="icon-[heroicons--chat-bubble-left] text-lg text-dark"></span>
                        <span className="icon-[heroicons--envelope] text-lg text-dark"></span>
                        <span className="icon-[heroicons--calendar] text-lg text-dark"></span>
                    </div>
                    <div className="h-4 w-px bg-dark"></div>
                    <div className="flex flex-1 items-center gap-4">
                        <span className="icon-[heroicons--magnifying-glass] text-lg text-dark"></span>
                        <input type="text" className="w-full outline-none" />
                    </div>
                    <div className="flex items-center text-dark">
                        <span className="icon-[la--flag-usa] text-2xl"></span>
                        <span className="text-sm">English</span>
                    </div>
                    <div className="flex items-center">
                        <span className="icon-[heroicons--bell] text-lg text-dark"></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-sm text-dark">Timothy Amo</span>
                            <span className="text-xs text-dark-50">Admin</span>
                        </div>
                        <span className="icon-[heroicons--user-circle-solid] text-3xl leading-none"></span>
                    </div>
                </nav>
                <div className="max-h-full flex-1 overflow-y-auto px-4">{children}</div>
            </main>
        </div>
    );
}
