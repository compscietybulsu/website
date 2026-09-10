"use client";

import { useCachedFetch } from "@/lib/useCachedFetch";
import SectionHeading from "./SectionHeading";
import { OFFICER_SLOTS } from "@/lib/aboutContent";

function OfficerCard({ name, photo, role, featured, loading }) {
  return (
    <div
      className={`rounded-2xl border border-green-200/10 flex flex-col items-center justify-center gap-4 px-4 ${
        featured ? "bg-[#132e1c] py-14" : "bg-transparent py-10"
      }`}
    >
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-black border-4 border-green-400 overflow-hidden">
        {loading ? (
          <div className="w-full h-full bg-white/10 animate-pulse" />
        ) : (
          photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={name} className="w-full h-full object-cover" />
          )
        )}
      </div>
      <div className="text-center w-full">
        {loading ? (
          <>
            <div className="h-4 w-24 bg-white/10 rounded animate-pulse mx-auto mb-2" />
            <div className="h-3 w-20 bg-white/10 rounded animate-pulse mx-auto" />
          </>
        ) : (
          <>
            <p className="font-heading font-semibold text-white text-sm">{name}</p>
            <p className="font-heading font-semibold text-green-300 text-xs tracking-widest uppercase mt-1">
              {role}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function OfficersSection() {
  const { data: leaders, loading } = useCachedFetch("leaders", "/api/leaders");

  function leaderFor(key) {
    return leaders.find((l) => l.key === key);
  }

  const sorted = [...OFFICER_SLOTS].sort((a, b) => a.order - b.order);
  const president = sorted.find((o) => o.featured);
  const rest = sorted.filter((o) => !o.featured);

  return (
    <section className="px-4 sm:px-8 mt-16">
      <SectionHeading>Officers</SectionHeading>
      <div className="mx-auto max-w-5xl mt-8">
        {president && (
          <div className="flex justify-center mb-6">
            <div className="w-full sm:w-64">
              <OfficerCard
                name={leaderFor(president.key)?.name || "TBA"}
                photo={leaderFor(president.key)?.photo || ""}
                role={president.role}
                featured
                loading={loading}
              />
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {rest.map((slot) => (
            <OfficerCard
              key={slot.key}
              name={leaderFor(slot.key)?.name || "TBA"}
              photo={leaderFor(slot.key)?.photo || ""}
              role={slot.role}
              loading={loading}
            />
          ))}
        </div>
      </div>
    </section>
  );
}