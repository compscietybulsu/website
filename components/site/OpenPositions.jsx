"use client";

import { APPLY_URL } from "@/lib/content/org";
import { useOrg } from "@/lib/useOrg";
import RoleIcon from "./RoleIcon";

export default function OpenPositions() {
  const { openPositions: OPEN_POSITIONS } = useOrg();
  const count = OPEN_POSITIONS.length;

  return (
    <section id="openings" style={{ scrollMarginTop: 100 }}>
      <div className="suggest-prev glass spot open-positions-card">
        <div className="open-positions-art" aria-hidden="true">
          <RoleIcon name="people" size={42} />
        </div>
        <div>
          <p className="kicker">open positions</p>
          <h2 style={{ marginTop: 8 }}>Ready to make an impact?</h2>
          <p>
            {count
              ? `${count} associate ${count === 1 ? "role is" : "roles are"} open. Any active member can apply to join the officer team.`
              : "There are no associate roles open right now. Check back for your chance to join the officer team."}
          </p>
        </div>
        <a className="btn btn-primary" href={APPLY_URL} target="_blank" rel="noopener noreferrer">
          Apply for position
        </a>
      </div>
    </section>
  );
}
