"use client";

import Link from "next/link";
import RoleIcon from "./RoleIcon";
import { APPLY_URL } from "@/lib/content/org";
import { useOrg } from "@/lib/useOrg";

// Sits beside the community channel box: the next step once you're a member.
export default function OfficerRoles() {
  const { openPositions } = useOrg();
  const n = openPositions.length;
  return (
    <div className="channel glass">
      <div className="channel-head">
        <i>
          <RoleIcon name="badge" size={20} />
        </i>
        <div>
          <h3>Want to do more?</h3>
          <p>
            {n ? `${n} committee role${n === 1 ? " is" : "s are"} still open.` : "Committee roles open up through the year."} Any active member can apply to join the
            officer team.
          </p>
        </div>
      </div>
      <div className="follow-links">
        <a className="btn btn-primary btn-sm" href={APPLY_URL} target="_blank" rel="noopener noreferrer">
          Apply for a role
        </a>
        <Link className="btn btn-glass btn-sm" href="/about#openings">
          See open roles
        </Link>
      </div>
    </div>
  );
}
