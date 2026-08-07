"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function PartnersSection() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/partners")
      .then(setPartners)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-4 sm:px-8 mt-16">
      <div className="mx-auto max-w-5xl rounded-3xl px-6 sm:px-10 py-10 bg-[#1f6b3c]">
        <h3 className="font-heading font-bold text-white text-xl mb-6">Our Partners</h3>

        {loading && <p className="text-white/70 text-sm">Loading partners...</p>}
        {!loading && error && <p className="text-white/70 text-sm">Couldn&apos;t load partners.</p>}
        {!loading && !error && partners.length === 0 && (
          <p className="text-white/70 text-sm">No partners added yet.</p>
        )}

        <div className="flex flex-wrap items-center gap-8 sm:gap-12">
          {partners.map((partner) => (
            <div key={partner._id} className="relative group">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden cursor-pointer border-2 border-transparent group-hover:border-white/60 transition-colors">
                {partner.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={partner.image} alt={partner.name} className="w-full h-full object-cover" />
                )}
              </div>

              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 z-20">
                <div className="rounded-xl bg-[#0d2818] border border-green-700/40 shadow-xl p-4 text-left">
                  <div className="w-full h-24 rounded-lg bg-gray-700 overflow-hidden mb-3">
                    {partner.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={partner.image} alt={partner.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <p className="font-heading font-bold text-white text-sm">{partner.name}</p>
                  {partner.detail && (
                    <p className="text-green-200/70 text-xs mt-1 leading-relaxed">{partner.detail}</p>
                  )}
                </div>
                <div className="w-3 h-3 bg-[#0d2818] border-r border-b border-green-700/40 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}