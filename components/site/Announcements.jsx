"use client";

import { Megaphone } from "lucide-react";
import { useCachedFetch } from "@/lib/useCachedFetch";
import { excerpt, plainText, shortDate } from "@/lib/text";

// Latest announcements from the admin panel. Renders nothing when there are none.
export default function Announcements({ count = 3 }) {
  const { data } = useCachedFetch("announcements", "/api/announcements");
  if (!data.length) return null;
  return (
    <section className="band t2">
      <div className="wrap">
        <div className="head">
          <div>
            <p className="kicker">announcements</p>
            <h2>Heads up</h2>
          </div>
        </div>
        <div className="announce">
          {data.slice(0, count).map((a) => {
            const Tag = a.link ? "a" : "div";
            const linkProps = a.link ? { href: a.link, target: "_blank", rel: "noopener noreferrer" } : {};
            return (
              <Tag key={a._id} className="announce-item glass spot" {...linkProps}>
                {a.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.image} alt="" loading="lazy" />
                ) : (
                  <span className="ico">
                    <Megaphone size={22} aria-hidden="true" />
                  </span>
                )}
                <div>
                  <span className="date">{shortDate(a.createdAt)}</span>
                  <b>{plainText(a.title)}</b>
                  {a.content && <p>{excerpt(a.content, 180)}</p>}
                  {a.link && <span className="link">Read more →</span>}
                </div>
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
