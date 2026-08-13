import SectionHeading from "./SectionHeading";
import SectionEmptyState from "./SectionEmptyState";
import { OFFICERS } from "@/lib/aboutContent";

export default function OfficersSection() {
  return (
    <section className="px-4 sm:px-8 mt-16">
      <SectionHeading>Officers</SectionHeading>
      {OFFICERS.length ? (
        <div className="mx-auto max-w-5xl grid sm:grid-cols-3 gap-6 mt-8 items-end">
          {OFFICERS.map((o) => (
            <div
              key={o.title}
              className={`rounded-2xl border border-green-200/10 flex flex-col items-center justify-center gap-4 px-4 ${
                o.featured ? "bg-[#132e1c] py-14" : "bg-transparent py-10"
              }`}
            >
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-black border-4 border-green-400 overflow-hidden flex items-center justify-center">
                {o.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={o.image}
                    alt={o.name || o.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-heading font-semibold text-green-300/40 text-xs tracking-widest uppercase text-center px-2">
                    Photo
                  </span>
                )}
              </div>
              {o.name && (
                <p className="font-heading font-semibold text-white text-sm">{o.name}</p>
              )}
              <p className="font-heading font-semibold text-green-300 text-xs sm:text-sm tracking-widest uppercase text-center">
                {o.title}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <SectionEmptyState>Officer roster to be announced by the organization.</SectionEmptyState>
      )}
    </section>
  );
}
