"use client";

import { useState } from "react";
import { initials } from "@/lib/text";

function hue(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return 150 + (h % 70);
}

// A broken admin upload falls back to the bundled photo, then to initials.
export default function Avatar({ person, vacant = false }) {
  const [failed, setFailed] = useState([]);
  if (vacant) return <div className="av" aria-hidden="true">+</div>;
  const photo = [person.photo, person.backupPhoto].find((src) => src && !failed.includes(src));
  if (photo) {
    return (
      <div className="av photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={photo} src={photo} alt={person.name} loading="lazy" onError={() => setFailed((f) => [...f, photo])} />
      </div>
    );
  }
  const h = hue(person.name);
  return (
    <div
      className="av"
      aria-hidden="true"
      style={{ background: `linear-gradient(135deg, hsl(${h + 50} 70% 45% / .75), hsl(${h} 60% 40% / .7))` }}
    >
      {initials(person.name)}
    </div>
  );
}
