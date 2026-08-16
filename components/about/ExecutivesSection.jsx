"use client";

import { useCachedFetch } from "@/lib/useCachedFetch";
import SectionHeading from "./SectionHeading";
import { EXECUTIVE_SLOTS } from "@/lib/aboutContent";

export default function ExecutivesSection() {
  const { data: leaders, loading } = useCachedFetch("leaders", "/api/leaders");

  return (
    <section className="px-4 sm:px-8 mt-16">
      <SectionHeading>Executives</SectionHeading>
      <div className="mx-auto max-w-5xl grid sm:grid-cols-4 gap-4 mt-8">
        {EXECUTIVE_SLOTS.map((slot) => {
          const leader = leaders.find((l) => l.key === slot.key);
          return (
            <div
              key={slot.key}
              className="rounded-xl bg-[#0d2818] py-8 px-4 flex flex-col items-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-gray-700 overflow-hidden shrink-0">
                {leader?.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <p className="font-heading font-semibold text-white text-sm">
                  {loading ? "Loading..." : leader?.name || "TBA"}
                </p>
                <p className="text-green-300/70 text-xs mt-1">{slot.role}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}