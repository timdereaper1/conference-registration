export default function StatusLabel({ status }: { status?: string }) {
    const statusMessageMap: Record<string, string> = {
        full: "Fully Paid",
        partial: "Partially Paid",
        pledge: "Pledge",
    };

    const text = status ? statusMessageMap[status] ?? "N/A" : "N/A";

    return (
        <span
            data-status={status}
            className="rounded px-2 py-1 text-xs font-semibold capitalize data-[status=full]:bg-success data-[status=partial]:bg-warning data-[status=full]:bg-opacity-[0.12] data-[status=partial]:bg-opacity-[0.12] data-[status=full]:text-success data-[status=partial]:text-warning"
        >
            {text}
        </span>
    );
}
