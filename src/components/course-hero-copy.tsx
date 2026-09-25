"use client";

import { useId, useState } from "react";

type CourseHeroCopyProps = {
  hasCover: boolean;
  title: string;
  longDescription: string;
};

export function CourseHeroCopy({
  hasCover,
  title,
  longDescription,
}: CourseHeroCopyProps) {
  const [expanded, setExpanded] = useState(false);
  const descriptionId = useId();
  const paragraphs = longDescription.split("\n\n");

  return (
    <div
      className={
        [
          "course-hero-copy",
          hasCover && "course-hero-copy--covered",
          expanded && "course-hero-copy--expanded",
        ]
          .filter(Boolean)
          .join(" ")
      }
    >
      <h1 className="page-title">{title}</h1>
      <div className="course-long-description" id={descriptionId}>
        {paragraphs.map((paragraph, index) => (
          <p key={`${index}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
        ))}
      </div>
      {hasCover && (
        <button
          aria-controls={descriptionId}
          aria-expanded={expanded}
          className="course-description-toggle"
          onClick={() => setExpanded((isExpanded) => !isExpanded)}
          type="button"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
