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
      "Learn to find sentence cores, recognize fragments, and join complete sentences through video lessons, guided practice, and ACT questions. More lessons are in progress.",
    longDescription:
      "Start with sentence structure: find who or what a sentence is about, identify its main verb, and check whether its core can stand on its own. The opening sequence pairs The Anatomy of a Sentence with custom practice and seven ACT fragment questions.\n\n" +
      "The custom practice moves from short examples to longer sentences with extra detail. You will find the subject and main verb even when a sentence includes -ing words, relative clauses, or other extra detail. Explanations show why each answer works.\n\n" +
      "Continue with Joining Sentences to learn how periods, semicolons, commas with conjunctions, and colons connect ideas. Five activities are available in the first module. Later lessons and the module mastery check are still planned. This course is being built; the current sequence covers sentence cores, fragments, and joining sentences, rather than the full ACT English curriculum.",
    coverImage: "/images/act-english-cover.jpg",
    modules: [
      {
        id: "sentence-structure",
        order: 1,
        title: "Sentence Structure",
        description:
          "Learn about sentence cores, fragments, and joining sentences: two videos, two custom practices, and seven ACT questions are available. The remaining six activities, including the module mastery check, are planned.",
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
              "What makes a sentence complete? In this first ACT English lesson, you'll learn to identify a sentence's subject and main verb, recognize fragments, and find the core structure even when a sentence includes extra detail. We'll look at how -ing forms and relative clauses beginning with words like “that” or “who” can make a group of words seem complete when it's still missing a main verb.",
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
            id: "eng-ss-joining-video",
            order: 4,
            type: "video",
            title: "Joining Sentences",
            availability: "published",
            muxPlaybackId: "fcS3JN100tcCbYttWB7ioL02FcTIveUpLO4G8OWvvP01Ns",
            durationSeconds: 594,
            summary: [
              "Learn how to join independent clauses with periods, semicolons, and commas followed by conjunctions such as “and,” “but,” or “so.” You'll spot comma splices, distinguish two complete clauses from two verbs sharing a subject, and use sentence cores to check connections in longer examples. We'll also look at colons: the statement before a colon must be complete, and the information after it explains or expands on that statement.",
            ],
          },
          {
            id: "eng-ss-separator-practice",
            order: 5,
            type: "custom-practice",
            title: "Separator Practice",
            availability: "published",
          },
          {
            id: "activity-06",
            order: 6,
            type: "act-practice",
            title: "ACT Practice 2",
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
            title: "Custom Practice 3",
            availability: "planned",
          },
          {
            id: "activity-09",
            order: 9,
            type: "custom-practice",
            title: "Custom Practice 4",
            availability: "planned",
          },
          {
            id: "activity-10",
            order: 10,
            type: "act-practice",
            title: "ACT Practice 3",
            availability: "planned",
          },
          {
            id: "activity-11",
            order: 11,
            type: "mastery-check",
            title: "Module Mastery Check",
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
