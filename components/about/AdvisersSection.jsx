import SectionHeading from "./SectionHeading";
import { ADVISERS } from "@/lib/aboutContent";

export default function AdvisersSection() {
  return (
    <section className="px-4 sm:px-8 mt-16">
      <SectionHeading>Advisers</SectionHeading>
      <div className="mx-auto max-w-5xl flex flex-wrap justify-center gap-6 mt-8">
        {ADVISERS.map((adviser) => (
          <div
            key={adviser.name}
            className="w-full sm:w-72 rounded-2xl p-6 bg-[#1a4d2e] flex flex-col items-center text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4">
              {adviser.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={adviser.photo} alt={adviser.name} className="w-full h-full object-cover" />
              )}
            </div>
            <p className="font-heading font-bold text-white">{adviser.name}</p>
            <p className="text-green-200/70 text-sm mt-1">{adviser.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}