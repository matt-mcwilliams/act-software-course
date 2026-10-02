export type AtomType =
  | "video"
  | "custom-practice"
  | "act-practice"
  | "mastery-check";

export type AtomAvailability = "planned" | "published";

export type AtomSummary = {
  id: string;
  order: number;
  type: AtomType;
  title: string;
  availability: AtomAvailability;
  muxPlaybackId?: string;
  durationSeconds?: number;
  masteryPercent?: number;
  summary?: string[];
};

export type ModuleSummary = {
  id: string;
  order: number;
  title: string;
  description: string;
  atoms: AtomSummary[];
};

export type CourseSummary = {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  coverImage?: string;
  modules: ModuleSummary[];
};

export const courses: CourseSummary[] = [
  {
    id: "act-english",
    title: "ACT English",
    shortDescription:
      "Course still in progress. Covers sentence structure, etc.",
    longDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae justo ac neque facilisis volutpat. Praesent non purus vel erat interdum fermentum. Sed at sapien sit amet mi tincidunt consequat. Curabitur euismod, lectus sed malesuada gravida, velit nibh posuere mauris, vitae porta magna est sed nisl.\n\n" +
      "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec ullamcorper, arcu eget tincidunt feugiat, lectus augue luctus erat, eget posuere neque libero at sem. Vivamus sollicitudin quam nec sem commodo, id gravida eros porta. Aenean at nibh eu risus interdum blandit.\n\n" +
      "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nam at neque vel mauris feugiat consequat. Aliquam erat volutpat. Morbi finibus lorem a risus tempor, sed tristique tortor mattis. Suspendisse potenti. Nulla facilisi.",
    coverImage: "/images/act-english-cover.jpg",
    modules: [
      {
        id: "sentence-structure",
        order: 1,
        title: "Sentence Structure",
        description:
          "11 activities: videos, custom practice, ACT practice problems, and a mastery checkLearn how sentences are constructed, how independent ideas can be joined correctly, and how modifiers and commas shape sentence meaning and clarity.",
        atoms: [
          {
            id: "eng-ss-anatomy-video",
            order: 1,
            type: "video",
            title: "The Anatomy of a Sentence",
            availability: "published",
            muxPlaybackId: "f5ZyKLBkU3EtwnLc02sLNWXBSEIBz1xN7oZd5Fj24eLI",
            durationSeconds: 384,
            summary: [
              "What makes a sentence complete? In this first ACT English lesson, you'll learn to identify a sentence's subject and main verb, recognize fragments, and find the core structure even when a sentence includes extra detail. We'll look at how -ing forms and relative clauses beginning with words like “that” or “who” can make a group of words seem complete when it's still missing a main-clause verb.",
              "Through short examples, practice sentences, and an ACT question, you'll build a practical method for checking sentence completeness and eliminating answer choices that leave a fragment. This foundation will prepare you for the next lesson: joining complete sentences correctly.",
            ],
          },
          {
            id: "eng-ss-anatomy-practice",
            order: 2,
            type: "custom-practice",
            title: "Sentence Anatomy Practice",
            availability: "published",
          },
          {
            id: "eng-ss-fragments-act-practice",
            order: 3,
            type: "act-practice",
            title: "ACT Practice: Fragments",
            availability: "published",
          },
          {
            id: "activity-04",
            order: 4,
            type: "video",
            title: "Video 2",
            availability: "planned",
          },
          {
            id: "activity-05",
            order: 5,
            type: "custom-practice",
            title: "Custom practice 2",
            availability: "planned",
          },
          {
            id: "activity-06",
            order: 6,
            type: "act-practice",
            title: "ACT practice problems 2",
            availability: "planned",
          },
          {
            id: "activity-07",
            order: 7,
            type: "video",
            title: "Video 3",
            availability: "planned",
          },
          {
            id: "activity-08",
            order: 8,
            type: "custom-practice",
            title: "Custom practice 3",
            availability: "planned",
          },
          {
            id: "activity-09",
            order: 9,
            type: "custom-practice",
            title: "Custom practice 4",
            availability: "planned",
          },
          {
            id: "activity-10",
            order: 10,
            type: "act-practice",
            title: "ACT practice problems 3",
            availability: "planned",
          },
          {
            id: "activity-11",
            order: 11,
            type: "mastery-check",
            title: "Module mastery check",
            availability: "planned",
          },
        ],
      },
    ],
  },
];

export function getCourseById(courseId: string) {
  return courses.find((course) => course.id === courseId);
}

export function getModuleById(course: CourseSummary, moduleId: string) {
  return course.modules.find((module) => module.id === moduleId);
}
