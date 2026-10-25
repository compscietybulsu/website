"use client";

import { useState } from "react";
import RoleIcon from "@/components/site/RoleIcon";
import { CHANNEL } from "@/lib/content/membership";
import { CONTACT_EMAIL } from "@/lib/content/site";

// Resending the invite needs a backend endpoint; until then this tells people exactly what to do.
export default function CommunityChannel() {
  const [open, setOpen] = useState(false);
  return (
    <div className="channel glass">
      <div className="channel-head">
        <i>
          <RoleIcon name="people" size={20} />
        </i>
        <div>
          <h3>{CHANNEL.title}</h3>
          <p>{CHANNEL.detail}</p>
        </div>
      </div>
      <div className="resend">
        <button type="button" className="btn btn-glass btn-sm" aria-expanded={open} aria-controls="resend-help" onClick={() => setOpen(!open)}>
          Not in the community channel yet?
        </button>
        {open && (
          <div id="resend-help" className="resend-form">
            <p className="resend-msg" style={{ color: "var(--muted)" }}>
              Check your spam folder for our confirmation email first. Still nothing? Email <b style={{ color: "var(--fg)" }}>{CONTACT_EMAIL}</b> from the address you signed
              up with, and we&apos;ll send you a fresh invite.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
