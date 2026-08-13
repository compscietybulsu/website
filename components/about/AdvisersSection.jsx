import SectionHeading from "./SectionHeading";
import SectionEmptyState from "./SectionEmptyState";
import { ADVISERS } from "@/lib/aboutContent";

export default function AdvisersSection() {
  return (
    <section className="px-4 sm:px-8 mt-16">
      <SectionHeading>Advisers</SectionHeading>
      {ADVISERS.length ? (
        <div className="mx-auto max-w-5xl grid sm:grid-cols-2 gap-6 mt-8">
          {ADVISERS.map((a, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 bg-[#1a4d2e] flex gap-5 items-start ${
                a.imageSide === "right" ? "flex-row-reverse" : ""
              }`}
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-xl bg-black overflow-hidden flex items-center justify-center">
                {a.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.image} alt={a.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-heading font-semibold text-green-300/40 text-xs tracking-widest uppercase">
                    Photo
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-green-100/80 text-sm leading-relaxed">{a.bio}</p>
                <p className="text-white text-sm mt-3 text-right">--{a.name}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <SectionEmptyState>Adviser profiles to be announced by the organization.</SectionEmptyState>
      )}
    </section>
  );
}
