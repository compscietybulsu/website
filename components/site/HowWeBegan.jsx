export default function HowWeBegan() {
  return (
    <section className="began">
      <div className="sub-head">
        <div>
          <p className="kicker">our story</p>
          <h2>How we began</h2>
          <p>A community built on code, creativity, and connection.</p>
        </div>
      </div>

      <div className="began-grid">
        <figure className="began-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/about/how-we-began.jpg" alt="CompSciety members together at an early society event" />
        </figure>

        <div className="began-text">
          <p>
            Every great community begins with an idea. Ours began with the belief that computer science is more than writing lines of code, building
            applications, or solving technical problems. It is about people, possibilities, and the impact we can create together.
          </p>
          <p>
            The <strong>Computer Science Society of Bulacan State University (CompSciety)</strong> was established with a vision of bringing together students who
            share a passion for technology, innovation, and lifelong learning. We envisioned a community where aspiring developers, problem-solvers,
            researchers, creatives, and future technology leaders could find not only opportunities to grow but also people with whom they could grow.
          </p>
          <p>
            We wanted to create something beyond the four walls of a classroom—a space where ideas could take shape, skills could be shared, friendships could
            flourish, and students could discover what they are capable of achieving when they work together.
          </p>
          <p>
            From technical workshops and collaborative learning initiatives to community engagement and student-led projects, CompSciety strives to make
            computer science more accessible, collaborative, and meaningful. We believe that learning should not stop at lectures, innovation should not be
            limited to laboratories, and technology should never lose sight of the people it is meant to serve.
          </p>
          <p>
            This vision continues through our initiatives, including <strong>C³ Series: Code • Create • Connect</strong>, which embodies our commitment to
            developing technical competencies, encouraging creativity, and strengthening connections within and beyond our university community.
          </p>
          <p>
            Today, CompSciety is more than an academic organization. It is a growing community of learners, builders, dreamers, and changemakers—united by
            curiosity and driven by the possibilities of technology.
          </p>
          <p>
            We may have started with a simple idea, but we continue to build something much bigger: a community where every student has the opportunity to
            learn, contribute, belong, and make a difference.
          </p>
          <p className="began-close">
            <strong>This is where we began. And this is only the beginning.</strong>
          </p>
          <p className="began-sign">
            <em>CompSciety Arise.</em>
          </p>
        </div>
      </div>
    </section>
  );
}