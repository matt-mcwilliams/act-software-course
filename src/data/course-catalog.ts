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
  description: string;
  modules: ModuleSummary[];
};

export const courses: CourseSummary[] = [
  {
    id: "act-english",
    title: "ACT English",
    description: "A clear sequence of videos and practice.",
    modules: [
      {
        id: "module-1",
        order: 1,
        title: "Module 1",
        description:
          "11 activities: videos, custom practice, ACT practice problems, and a mastery check.",
        atoms: [
          {
            id: "atom-01",
            order: 1,
            type: "video",
            title: "Video 1",
            availability: "planned",
          },
          {
            id: "atom-02",
            order: 2,
            type: "custom-practice",
            title: "Custom practice 1",
            availability: "planned",
          },
          {
            id: "atom-03",
            order: 3,
            type: "act-practice",
            title: "ACT practice problems 1",
            availability: "planned",
          },
          {
            id: "atom-04",
            order: 4,
            type: "video",
            title: "Video 2",
            availability: "planned",
          },
          {
            id: "atom-05",
            order: 5,
            type: "custom-practice",
            title: "Custom practice 2",
            availability: "planned",
          },
          {
            id: "atom-06",
            order: 6,
            type: "act-practice",
            title: "ACT practice problems 2",
            availability: "planned",
          },
          {
            id: "atom-07",
            order: 7,
            type: "video",
            title: "Video 3",
            availability: "planned",
          },
          {
            id: "atom-08",
            order: 8,
            type: "custom-practice",
            title: "Custom practice 3",
            availability: "planned",
          },
          {
            id: "atom-09",
            order: 9,
            type: "custom-practice",
            title: "Custom practice 4",
            availability: "planned",
          },
          {
            id: "atom-10",
            order: 10,
            type: "act-practice",
            title: "ACT practice problems 3",
            availability: "planned",
          },
          {
            id: "atom-11",
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
