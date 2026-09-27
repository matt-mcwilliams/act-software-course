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
  const previewText = longDescription
    .replace(/\s+/g, " ")
    .slice(0, 80)
    .trimEnd();

  const toggle = (
    <button
      aria-controls={descriptionId}
      aria-expanded={expanded}
      className="course-description-toggle"
      onClick={() => setExpanded((isExpanded) => !isExpanded)}
      type="button"
    >
      {expanded ? "read less" : "read more"}
    </button>
  );

  return (
    <div className="course-hero-copy">
      <h1 className="page-title">{title}</h1>
      <div className="course-long-description" id={descriptionId}>
        {hasCover && !expanded ? (
          <p>{previewText}… {toggle}</p>
        ) : (
          paragraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 12)}`}>
              {paragraph}
              {hasCover && index === paragraphs.length - 1 && <> {toggle}</>}
            </p>
          ))
        )}
      </div>
    </div>
  );
}
