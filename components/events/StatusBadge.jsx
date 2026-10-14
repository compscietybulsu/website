import { STATUS_META } from "@/lib/eventUtils";

export default function StatusBadge({ status }) {
    const meta = STATUS_META[status];
    if (!meta) return null;
    return (
        <span
            className={`inline-block rounded-full border px-3 py-1 text-xs font-heading font-semibold ${meta.className}`}
        >
            {meta.label}
        </span>
    );
}
