"use client";

import { APPLY_URL } from "@/lib/content/org";
import { useOrg } from "@/lib/useOrg";

export default function OpenPositions() {
  const { openPositions: OPEN_POSITIONS } = useOrg();
  return (
    <section id="openings" style={{ scrollMarginTop: 100 }}>
      <div className="sub-head">
        <div>
          <p className="kicker">join the team</p>
          <h2>
            {OPEN_POSITIONS.length} open position{OPEN_POSITIONS.length === 1 ? "" : "s"}
          </h2>
          <p>These associate roles are still vacant. Any active member can apply.</p>
        </div>
        <a className="btn btn-primary btn-sm" href={APPLY_URL} target="_blank" rel="noopener noreferrer">
          Apply for a position
        </a>
      </div>
      <div className="openings">
        {OPEN_POSITIONS.map(({ role, committee }) => (
          <div key={role} className="opening">
            <span className="code">{committee.code}</span>
            <b>{role}</b>
            <p>
              {committee.name} Committee · reports to the {committee.head.role}
            </p>
            <a className="btn btn-glass btn-sm" href={APPLY_URL} target="_blank" rel="noopener noreferrer">
              Apply
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
