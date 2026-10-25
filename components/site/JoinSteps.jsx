import { JOIN_STEPS } from "@/lib/content/membership";

export default function JoinSteps() {
  return (
    <div className="steps glass">
      <h3>How to join</h3>
      <ol>
        {JOIN_STEPS.map((s) => (
          <li key={s.title} className="tile">
            <div>
              <b>{s.title}</b>
              <span>{s.detail}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
