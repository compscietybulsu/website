"use client";

import { useCallback, useState } from "react";
import Avatar from "./Avatar";
import Modal from "./Modal";
import { ADVISER, APPLY_URL } from "@/lib/content/org";
import { CONTACT_EMAIL } from "@/lib/content/site";
import { useOrg } from "@/lib/useOrg";

function Node({ person, top = false, onOpen }) {
  return (
    <button type="button" className={`node glass${top ? " top" : ""}`} aria-haspopup="dialog" onClick={() => onOpen({ person })}>
      {top ? (
        <div className="av-ring">
          <Avatar person={person} />
        </div>
      ) : (
        <Avatar person={person} />
      )}
      <div>
        <span className="role">{person.role}</span>
        <b>{person.name}</b>
      </div>
    </button>
  );
}

// Officer's own email when we have it; otherwise the society inbox with their name in the subject.
function contactHref(person) {
  if (person.email) return `mailto:${person.email}`;
  const subject = `For ${person.name} (${person.role})`;
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

function Profile({ person, committee, onBack }) {
  const first = person.name.split(" ")[0];
  return (
    <div className="roster profile">
      {onBack && (
        <button type="button" className="back-link" onClick={onBack}>
          ← {committee.name} Committee
        </button>
      )}
      <div className="profile-head">
        <div className="av-ring">
          <Avatar person={person} />
        </div>
        <div>
          <span className="mono" style={{ color: "var(--blue-soft)" }}>
            {committee ? `${committee.code} · ${committee.name} Committee` : "CompSciety officer"}
          </span>
          <h3 id="roster-title">{person.name}</h3>
          <p>{person.role}</p>
        </div>
      </div>
      <div className="profile-contact">
        <a className="btn btn-primary btn-sm" href={contactHref(person)}>
          Email {first}
        </a>
        <span>
          {person.email ? (
            <b>{person.email}</b>
          ) : (
            <>
              Goes to <b>{CONTACT_EMAIL}</b>, addressed to {first}.
            </>
          )}
        </span>
      </div>
    </div>
  );
}

function CommitteeCard({ committee, onOpen }) {
  const open = committee.team.filter((m) => !m.name).length;
  const filled = 1 + committee.team.length - open;
  return (
    <button type="button" className="com-card" aria-haspopup="dialog" onClick={() => onOpen(committee)}>
      <span className="code">{committee.code}</span>
      <h3>{committee.name}</h3>
      <div className="head-row">
        <Avatar person={committee.head} />
        <span>{committee.head.name}</span>
      </div>
      <div className="foot">
        <span className="count">
          {filled} member{filled > 1 ? "s" : ""}
        </span>
        {open > 0 && <span className="open-badge">{open} open</span>}
      </div>
    </button>
  );
}

function Roster({ committee, onPerson }) {
  return (
    <div className="roster">
      <span className="mono" style={{ color: "var(--blue-soft)" }}>
        {committee.code} · {committee.branch === "internal" ? "Internal" : "External"} Affairs
      </span>
      <h3 id="roster-title">{committee.name} Committee</h3>
      <p>{committee.about}</p>
      <div className="roster-list">
        <button type="button" className="person lead" onClick={() => onPerson(committee.head)}>
          <Avatar person={committee.head} />
          <div>
            <b>{committee.head.name}</b>
            <span>{committee.head.role}</span>
          </div>
        </button>
        {committee.team.map((m, i) =>
          m.name ? (
            <button key={i} type="button" className="person" onClick={() => onPerson(m)}>
              <Avatar person={m} />
              <div>
                <b>{m.name}</b>
                <span>{m.role}</span>
              </div>
            </button>
          ) : (
            <div key={i} className="person vacant">
              <Avatar vacant />
              <div>
                <b>Open position</b>
                <span>{m.role}</span>
              </div>
              <a className="btn btn-glass btn-sm" href={APPLY_URL} target="_blank" rel="noopener noreferrer">
                Apply
              </a>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function OrgChart() {
  const { executives: EXECUTIVES, committees: COMMITTEES } = useOrg();
  const BRANCHES = [
    { id: "internal", label: "Internal Affairs", vp: EXECUTIVES.internalVp },
    { id: "external", label: "External Affairs", vp: EXECUTIVES.externalVp },
  ];
  // { committee } shows a roster; { person, committee? } shows one officer's profile.
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const openCommittee = (c) => setOpen({ committee: c });
  const live = open?.committee && (COMMITTEES.find((c) => c.id === open.committee.id) ?? open.committee);
  return (
    <>
      <div className="tree">
        <Node person={ADVISER} onOpen={setOpen} />
        <div className="vline" />
        <Node person={EXECUTIVES.president} top onOpen={setOpen} />
        <div className="vline" />
        <Node person={EXECUTIVES.chiefOfStaff} onOpen={setOpen} />
        <div className="vline" />
        <div className="split">
          {BRANCHES.map((b) => (
            <div key={b.id}>
              <div className="vline" />
              <Node person={b.vp} onOpen={setOpen} />
            </div>
          ))}
        </div>
      </div>
      <div className="branches">
        {BRANCHES.map((b) => (
          <div key={b.id} className="branch glass">
            <div className="branch-head">
              <b>{b.label}</b>
              <span>under {b.vp.name}</span>
            </div>
            <div className="com-grid">
              {COMMITTEES.filter((c) => c.branch === b.id).map((c) => (
                <CommitteeCard key={c.id} committee={c} onOpen={openCommittee} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {open && (
        <Modal labelledBy="roster-title" onClose={close}>
          {open.person ? (
            <Profile person={open.person} committee={live} onBack={live ? () => openCommittee(live) : null} />
          ) : (
            <Roster committee={live} onPerson={(person) => setOpen({ person, committee: live })} />
          )}
        </Modal>
      )}
    </>
  );
}
