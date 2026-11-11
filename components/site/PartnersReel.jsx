"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";

// Real partners from the admin panel, padded with "your logo here" slots so the reel always fills.
const MIN_ITEMS = 8;

function Item({ partner, hidden }) {
  const extra = hidden ? { "aria-hidden": true, tabIndex: -1 } : {};
  const image = typeof partner.image === "string" ? partner.image.trim() : "";
  // if (!partner) {
  //   return (
  //     <Link className="logo-item" href="/contact" {...extra}>
  //       <span className="logo-circle">
  //         <Plus size={36} strokeWidth={1.5} aria-hidden="true" />
  //       </span>
  //       <b>Your logo here</b>
  //       <span>partner with us</span>
  //     </Link>
  //   );
  // }
  return (
    <div className="logo-item" {...extra}>
      <span className="logo-circle">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={hidden ? "" : `${partner.name} logo`} loading="lazy" />
        )}
      </span>
      <b>{partner.name}</b>
      {partner.detail && <span>{partner.detail}</span>}
    </div>
  );
}

export default function PartnersReel() {
  const [partners, setPartners] = useState(null);
  const [layout, setLayout] = useState(null);
  const marqueeRef = useRef(null);
  const firstSetRef = useRef(null);

  useEffect(() => {
    api.get("/api/partners").then(setPartners).catch(() => setPartners([]));
  }, []);

  useEffect(() => {
    if (!partners?.length || !marqueeRef.current || !firstSetRef.current) return;

    const marquee = marqueeRef.current;
    const firstSet = firstSetRef.current;
    const updateLayout = () => {
      const setWidth = firstSet.getBoundingClientRect().width;
      const viewportWidth = marquee.clientWidth;
      if (setWidth <= 0 || viewportWidth <= 0) return;

      const cycleCount = Math.ceil(viewportWidth / setWidth);
      const nextLayout = {
        copies: cycleCount + 2,
        distance: setWidth,
        viewportWidth,
      };
      setLayout((current) =>
        current?.copies === nextLayout.copies &&
        current?.distance === nextLayout.distance &&
        current?.viewportWidth === nextLayout.viewportWidth
          ? current
          : nextLayout,
      );
    };

    const observer = new ResizeObserver(updateLayout);
    observer.observe(marquee);
    observer.observe(firstSet);
    updateLayout();
    return () => observer.disconnect();
  }, [partners]);

  if (partners === null || partners.length === 0) return null;
  // const slots = [...partners, ...Array(Math.max(0, MIN_ITEMS - partners.length)).fill(null)];
  const slots = partners;
  return (
    <div className="marquee" ref={marqueeRef} tabIndex={0} aria-label="Our partners">
      <div
        className="marquee-entry"
        data-ready={layout !== null}
        style={
          layout
            ? {
                "--marquee-width": `${layout.viewportWidth}px`,
              }
            : undefined
        }
      >
        <div
          className="track"
          data-ready={layout !== null}
          style={layout ? { "--marquee-distance": `${layout.distance}px` } : undefined}
        >
          {Array.from({ length: layout?.copies ?? 2 }, (_, groupIndex) => (
            <div
              className="marquee-set"
              key={groupIndex}
              ref={groupIndex === 0 ? firstSetRef : undefined}
              aria-hidden={groupIndex > 0 ? true : undefined}
            >
              {slots.map((partner, index) => (
                <Item
                  key={`${groupIndex}-${index}`}
                  partner={partner}
                  hidden={groupIndex > 0}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
