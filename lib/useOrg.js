"use client";

import { useMemo } from "react";
import { useCachedFetch } from "./useCachedFetch";
import { COMMITTEES, EXECUTIVES, EXECUTIVE_KEYS } from "./content/org";

const norm = (s) => (s || "").toLowerCase().replace(/[^a-z ]/g, "").trim();

// Same person if first and last names match, so "Juan P. Cruz" and "Juan Cruz" line up.
function samePerson(a, b) {
  const x = norm(a).split(/\s+/);
  const y = norm(b).split(/\s+/);
  return x.length > 0 && x[0] === y[0] && x[x.length - 1] === y[y.length - 1];
}

// An admin-panel entry wins; the fallback photo, email and title are kept only when it's the same person.
function merge(fallback, entry) {
  if (!entry?.name) return fallback;
  const keepPhoto = fallback?.name && samePerson(fallback.name, entry.name);
  return {
    ...fallback,
    name: entry.name,
    role: keepPhoto ? fallback.role : fallback?.baseRole || fallback?.role,
    photo: entry.photo || (keepPhoto ? fallback.photo : undefined),
    backupPhoto: keepPhoto ? fallback.photo : undefined,
    email: keepPhoto ? fallback.email : undefined,
  };
}

function mergeTeam(team, members) {
  const out = team.map((m) => ({ ...m }));
  for (const m of members) {
    const i = out.findIndex((t) => !t.fromAdmin && norm(t.role) === norm(m.role));
    const entry = { ...merge(i >= 0 ? out[i] : null, m), role: m.role, fromAdmin: true };
    if (i >= 0) out[i] = entry;
    else out.push(entry);
  }
  return out;
}

// Org chart with live leaders and committee members from the admin panel laid over lib/content/org.js.
export function useOrg() {
  const { data: leaders } = useCachedFetch("leaders", "/api/leaders");
  const { data: members } = useCachedFetch("committee-members", "/api/committee-members");

  return useMemo(() => {
    const byKey = Object.fromEntries(leaders.map((l) => [l.key, l]));
    const executives = Object.fromEntries(Object.entries(EXECUTIVES).map(([k, p]) => [k, merge(p, byKey[EXECUTIVE_KEYS[k]])]));
    const committees = COMMITTEES.map((c) => ({
      ...c,
      head: merge(c.head, byKey[c.slug]),
      team: mergeTeam(
        c.team,
        members.filter((m) => m.committeeSlug === c.slug)
      ),
    }));
    const openPositions = committees.flatMap((committee) => committee.team.filter((m) => !m.name).map((m) => ({ role: m.role, committee })));
    return { executives, committees, openPositions };
  }, [leaders, members]);
}
