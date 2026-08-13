import SectionHeading from "./SectionHeading";
import SectionEmptyState from "./SectionEmptyState";
import { EXECUTIVES } from "@/lib/aboutContent";

export default function ExecutivesSection() {
  return (
    <section className="px-4 sm:px-8 mt-16">
      <SectionHeading>Executives</SectionHeading>
      {EXECUTIVES.length ? (
        <div className="mx-auto max-w-5xl grid sm:grid-cols-4 gap-4 mt-8">
          {EXECUTIVES.map((e, i) => (
            <div
              key={i}
              className="rounded-xl bg-[#0d2818] py-10 px-4 flex flex-col items-center justify-center text-center gap-2"
            >
              <p className="font-heading font-semibold text-white text-sm">{e.role}</p>
              {e.name && <p className="text-green-300/70 text-xs">{e.name}</p>}
            </div>
          ))}
        </div>
      ) : (
        <SectionEmptyState>Executive roster to be announced by the organization.</SectionEmptyState>
      )}
    </section>
  );
}
