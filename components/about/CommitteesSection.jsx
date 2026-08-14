"use client";

import { useEffect, useState } from "react";
import SectionHeading from "./SectionHeading";
import { COMMITTEES_META } from "@/lib/aboutContent";
import { api } from "@/lib/api";

function MemberRow({ name, role, photo, isHead }) {
  return (
    <li className="flex items-center gap-3">
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-700 overflow-hidden shrink-0">
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0 flex items-baseline justify-between gap-3 text-sm">
        <span className={`truncate ${isHead ? "text-white font-semibold" : "text-white"}`}>{name}</span>
        <span className="text-green-200/60 text-xs text-right shrink-0">{role}</span>
      </div>
    </li>
  );
}

export default function CommitteesSection() {
  const [members, setMembers] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/api/committee-members"), api.get("/api/leaders")])
      .then(([membersData, leadersData]) => {
        setMembers(membersData);
        setLeaders(leadersData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-4 sm:px-8 mt-16 mb-20">
      <SectionHeading>Committees</SectionHeading>

      {loading && <p className="text-green-200/70 text-sm mt-8 text-center">Loading committees...</p>}
      {!loading && error && (
        <p className="text-green-200/70 text-sm mt-8 text-center">
          Couldn&apos;t load committee members right now.
        </p>
      )}

      {!loading && !error && (
        <div className="mx-auto max-w-5xl grid sm:grid-cols-2 gap-4 mt-8">
          {COMMITTEES_META.map((committee) => {
            const associates = members.filter((m) => m.committeeSlug === committee.slug);
            const head = leaders.find((l) => l.key === committee.slug);
            return (
              <div key={committee.slug} className="rounded-xl bg-[#1a4d2e] p-5">
                <p className="font-heading font-bold text-white mb-3">{committee.name}</p>
                <ul className="space-y-2">
                  <MemberRow
                    name={head?.name || "TBA"}
                    role={committee.headRole}
                    photo={head?.photo || ""}
                    isHead
                  />
                  {associates.map((a) => (
                    <MemberRow key={a._id} name={a.name} role={a.role} photo={a.photo} />
                  ))}
                  {associates.length === 0 && (
                    <li className="text-green-200/40 text-xs italic pl-11">No associates added yet</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}