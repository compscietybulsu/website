import { ABOUT_PARAGRAPH, ABOUT_IMAGE, ABOUT_IMAGE_ALT } from "@/lib/aboutContent";

export default function AboutIntro() {
  return (
    <section className="px-4 sm:px-8 pt-14">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-heading font-extrabold text-white text-4xl sm:text-5xl mb-8">
          About CompSciety
        </h1>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <p className="text-green-200/80 text-sm sm:text-base leading-relaxed">{ABOUT_PARAGRAPH}</p>
          <div className="w-full aspect-[4/3] rounded-2xl bg-[#0d2818] overflow-hidden flex items-center justify-center">
            {ABOUT_IMAGE ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ABOUT_IMAGE} alt={ABOUT_IMAGE_ALT} className="w-full h-full object-cover" />
            ) : (
              <span className="font-heading font-semibold text-green-300/40 text-xs tracking-widest uppercase text-center px-4">
                Photo to be provided
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
