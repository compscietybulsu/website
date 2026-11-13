import Image from "next/image";
import Link from "next/link";
import DatacampCourseCarousel from "@/components/site/DatacampCourseCarousel";

const BENEFITS = [
  {
    title: "Full learning curriculum",
    description:
      "Access DataCamp's extensive collection of courses, exercises, assessments, and hands-on projects.",
  },
  {
    title: "Professional certifications",
    description:
      "Build and demonstrate your technical competencies through opportunities to earn industry-recognized certifications.",
  },
  {
    title: "DataLab access",
    description:
      "Use DataCamp's cloud-based development environment for coding, data analysis, and experimentation.",
  },
  {
    title: "Self-paced learning",
    description:
      "Learn whenever and wherever you want through DataCamp's online platform and mobile application.",
  },
  {
    title: "Additional opportunities",
    description:
      "Take part in learning assignments, competitions, exclusive events, and other educational activities.",
  },
];

function ApplyButton() {
  return (
    <button className="btn btn-primary datacamp-apply" type="button" disabled>
      Apply Now
    </button>
  );
}

export default function Datacamp() {
  return (
    <>
      <section className="datacamp-hero">
        <div className="wrap">
          <p className="crumbs">
            <Link href="/">home</Link>/<span>datacamp</span>
          </p>
          <div className="datacamp-hero-main">
            <div className="datacamp-hero-copy">
              <p className="kicker">DataCamp Donates scholarship</p>
              <h1>
                Make your next skill <span className="grad-text">your own.</span>
              </h1>
              <p className="datacamp-hero-subtext">
                Build practical, career-ready skills with one year of free DataCamp Premium access for selected Bulacan
                State University students.
              </p>
            </div>
            <div className="datacamp-hero-art">
              <Image
                src="/DC_Donates_logo_regular.png"
                alt="DataCamp Donates"
                width={1630}
                height={450}
                priority
                sizes="(max-width: 760px) 80vw, 36vw"
              />
            </div>
          </div>
          <div className="datacamp-hero-actions">
            <ApplyButton />
          </div>
        </div>
      </section>

      <div className="wrap page-body datacamp-body">
        <section>
          <div className="sub-head">
            <div>
              <p className="kicker">the scholarship</p>
              <h2>What you get</h2>
              <p>Selected scholars receive one year of free DataCamp Premium access, with tools and resources to keep learning.</p>
            </div>
          </div>
          <div className="datacamp-benefits">
            {BENEFITS.map((benefit, index) => (
              <article className="datacamp-benefit glass" key={benefit.title}>
                <span className="datacamp-benefit-number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="sub-head">
            <div>
              <p className="kicker">learn by doing</p>
              <h2>Explore skills that move you forward</h2>
              <p>Discover hands-on learning paths across programming, data, and cloud technologies.</p>
            </div>
          </div>
          <DatacampCourseCarousel />
        </section>

        <section className="cta glass datacamp-cta">
          <div>
            <span className="mono">$ datacamp start --learning</span>
            <h2>
              Ready to start <span className="grad-text">learning?</span>
            </h2>
            <p>
              Expand your technical knowledge, develop practical skills, and prepare for future opportunities in the
              technology industry.
            </p>
          </div>
          <div className="cta-actions datacamp-cta-actions">
            <ApplyButton />
          </div>
        </section>
      </div>
    </>
  );
}
