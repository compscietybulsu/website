import Link from "next/link";
import GradientPillButton from "@/components/ui/GradientPillButton";
import StatusBadge from "./StatusBadge";
import { formatEventDates } from "@/lib/eventUtils";

function excerpt(text, length = 180) {
    if (!text) return "";
    if (text.length <= length) return text;
    return text.slice(0, length).trim() + "...";
}

export default function EventCard({ event }) {
    return (
        <div className="grid sm:grid-cols-2 gap-6 items-start mb-10">
            <Link href={`/events/${event._id}`} className="block">
                <div className="w-full aspect-[4/3] rounded-2xl bg-gray-200 overflow-hidden">
                    {event.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    )}
                </div>
            </Link>
            <div className="flex flex-col items-start">
                <StatusBadge status={event.status} />
                <Link href={`/events/${event._id}`}>
                    <h3 className="font-heading font-extrabold text-green-400 text-2xl sm:text-3xl mt-3 mb-2 hover:text-green-300 transition-colors">
                        {event.title}
                    </h3>
                </Link>
                <p className="text-green-200/80 text-sm font-semibold">
                    {formatEventDates(event.startDate, event.endDate)}
                </p>
                {event.location && <p className="text-green-200/60 text-sm mb-3">{event.location}</p>}
                <p className="text-green-100/80 text-sm leading-relaxed mb-5">
                    {excerpt(event.description || event.content)}
                </p>
                <GradientPillButton href={`/events/${event._id}`}>View Details</GradientPillButton>
            </div>
        </div>
    );
}
