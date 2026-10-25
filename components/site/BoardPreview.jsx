"use client";

import Link from "next/link";
import Avatar from "./Avatar";
import { ACADEMIC_YEAR } from "@/lib/content/org";
import { useOrg } from "@/lib/useOrg";

// Home-page teaser for the About page, using the live officer list.
export default function BoardPreview() {
  const { executives } = useOrg();
  return (
    <Link className="board-prev glass spot" href="/about" style={{ textDecoration: "none" }}>
      <span className="mono" style={{ color: "var(--blue-soft)" }}>
        led by {executives.president.role} {executives.president.name} · A.Y. {ACADEMIC_YEAR}
      </span>
      <div className="avatars">
        {Object.values(executives).map((p) => (
          <Avatar key={p.role} person={p} />
        ))}
      </div>
      <h3>Meet the officers, our adviser and the 8 committees behind every event</h3>
      <span className="link">
        Meet the team <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
