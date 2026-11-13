"use client";

import { useEffect, useRef, useState } from "react";
import { FaAws, FaDatabase, FaJava } from "react-icons/fa";
import { SiDatacamp, SiDocker, SiGithub, SiPython } from "react-icons/si";

function AzureIcon({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="currentColor" d="M18 5h12L14 43H3L18 5Zm14 0h8l6 38H19l5-10h10L32 5Z" />
    </svg>
  );
}

const COURSES = [
  { name: "Python", Icon: SiPython, color: "#3776ab" },
  { name: "SQL", Icon: FaDatabase, color: "#4b8bbe" },
  { name: "Java", Icon: FaJava, color: "#ed8b00" },
  { name: "Docker", Icon: SiDocker, color: "#2496ed" },
  { name: "GitHub", Icon: SiGithub, color: "currentColor" },
  { name: "Azure", Icon: AzureIcon, color: "#0089d6" },
  { name: "AWS", Icon: FaAws, color: "#ff9900" },
  { name: "DataLab", Icon: SiDatacamp, color: "#03ef62" },
];

function Course({ course, hidden }) {
  const extra = hidden ? { "aria-hidden": true, tabIndex: -1 } : {};
  const { name, Icon, color } = course;

  return (
    <div className="logo-item" {...extra}>
      <span className="logo-circle">
        <Icon style={{ color }} aria-hidden="true" />
      </span>
      <b>{name}</b>
      <span>learning path</span>
    </div>
  );
}

export default function DatacampCourseCarousel() {
  const marqueeRef = useRef(null);
  const firstSetRef = useRef(null);
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    if (!marqueeRef.current || !firstSetRef.current) return;

    const marquee = marqueeRef.current;
    const firstSet = firstSetRef.current;
    const updateLayout = () => {
      const setWidth = firstSet.getBoundingClientRect().width;
      const viewportWidth = marquee.clientWidth;
      if (setWidth <= 0 || viewportWidth <= 0) return;

      const nextLayout = {
        copies: Math.ceil(viewportWidth / setWidth) + 2,
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
  }, []);

  return (
    <div className="marquee datacamp-marquee" ref={marqueeRef} tabIndex={0} aria-label="DataCamp learning paths">
      <div
        className="marquee-entry"
        data-ready={layout !== null}
        style={layout ? { "--marquee-width": `${layout.viewportWidth}px` } : undefined}
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
              {COURSES.map((course) => (
                <Course key={`${groupIndex}-${course.name}`} course={course} hidden={groupIndex > 0} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
