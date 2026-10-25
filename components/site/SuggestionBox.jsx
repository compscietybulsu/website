"use client";

import { useEffect, useRef, useState } from "react";
import { CONTACT_EMAIL } from "@/lib/content/site";
import { useSearch } from "@/lib/useToday";

const MAX = 500;

// Submissions aren't stored yet (that needs a backend endpoint). Until then, "Send" copies
// the note and asks the visitor to email it, so nothing pretends to be sent.
// Links like /contact?topic=Website land here with the note box focused.
export default function SuggestionBox() {
  const search = useSearch();
  return <Box key={search ?? "prerender"} focus={!!new URLSearchParams(search ?? "").get("topic")} />;
}

function Box({ focus }) {
  const [text, setText] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [name, setName] = useState("");
  const [status, setStatus] = useState(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (focus) textRef.current?.focus();
  }, [focus]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setStatus({ kind: "err", msg: "Write something first. Even “more pizza” counts." });
      textRef.current?.focus();
      return;
    }
    const note = `${text.trim()}${!anonymous && name.trim() ? `\n\nFrom ${name.trim()}` : ""}`;
    let copied = false;
    try {
      await navigator.clipboard.writeText(note);
      copied = true;
    } catch {}
    setStatus({ kind: "ok", copied });
  };

  return (
    <form className="sbox glass" onSubmit={submit} noValidate>
      <div style={{ display: "grid", gap: 18 }}>
        <div>
          <label className="lbl" htmlFor="s-text">
            Your note
          </label>
          <textarea
            id="s-text"
            ref={textRef}
            maxLength={MAX}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your thoughts here…"
          />
          <div className="count">
            {text.length} / {MAX}
          </div>
        </div>
        <label className="toggle" htmlFor="s-anon">
          <input type="checkbox" id="s-anon" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
          <span className="sw" />
          <span>Stay anonymous</span>
        </label>
        {!anonymous && (
          <div>
            <label className="lbl" htmlFor="s-name">
              Your name
            </label>
            <input type="text" id="s-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="So we can reach you" />
          </div>
        )}
        {status?.kind === "err" && <p className="resend-msg err" role="alert">{status.msg}</p>}
        {status?.kind === "ok" && (
          <p className="coming-soon" role="status">
            <b>Online submissions open soon.</b>{" "}
            {status.copied ? "We copied your note, so paste it" : "For now, send your note"} in an email to <b>{CONTACT_EMAIL}</b> and the officers will read it.
          </p>
        )}
        <div className="s-actions">
          <span className="note">{anonymous ? "Anonymous notes don't include your name." : "We'll only use your name to follow up."}</span>
          <button className="btn btn-primary" type="submit">
            Drop it in the box
          </button>
        </div>
      </div>
    </form>
  );
}
