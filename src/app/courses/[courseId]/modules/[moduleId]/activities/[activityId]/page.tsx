import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/course-navigation";
import { ActivitySidebar } from "@/components/activity-sidebar";
import { VideoLesson } from "@/components/video-lesson";
import { SeparatorPractice } from "@/components/separator-practice";
import { SentencePractice } from "@/components/sentence-practice";
import { ActSentencePractice } from "@/components/act-sentence-practice";
import { isSupportedActivity } from "@/lib/course-activities";
import { getActSentenceQuestions } from "@/data/act-sentence-practice";
import { courses, getCourseById, getModuleById } from "@/data/course-catalog";
import "@/components/video-lesson.css";
import "@/components/sentence-practice.css";
import "@/components/separator-practice.css";
import "@/components/act-sentence-practice.css";

export function generateStaticParams() {
  return courses.flatMap((course) => course.modules.flatMap((module) =>
    module.atoms.filter(isSupportedActivity).map((atom) => ({
      courseId: course.id, moduleId: module.id, activityId: atom.id,
    })),
  ));
}

type AtomPageProps = {
  params: Promise<{ courseId: string; moduleId: string; activityId: string }>;
};

function getActivity(courseId: string, moduleId: string, activityId: string) {
  const course = getCourseById(courseId);
  const courseModule = course ? getModuleById(course, moduleId) : undefined;
  const atom = courseModule?.atoms.find((entry) => entry.id === activityId);
  if (!course || !courseModule || !atom || atom.availability !== "published" ||
    !isSupportedActivity(atom)) {
    notFound();
  }
  return { course, courseModule, atom };
}

export async function generateMetadata({ params }: AtomPageProps): Promise<Metadata> {
  const { courseId, moduleId, activityId } = await params;
  const { course, courseModule, atom } = getActivity(courseId, moduleId, activityId);
  return { title: atom.title, description: `${atom.type === "video" ? "Watch" : "Practice"} ${atom.title} in ${course.title}: ${courseModule.title}.` };
}

export default async function AtomPage({ params }: AtomPageProps) {
  const { courseId, moduleId, activityId } = await params;
  const { course, courseModule, atom } = getActivity(courseId, moduleId, activityId);
  const atoms = [...courseModule.atoms].sort((a, b) => a.order - b.order);
  const moduleHref = `/courses/${course.id}/modules/${courseModule.id}`;
  const next = atoms[atoms.findIndex((entry) => entry.id === atom.id) + 1];
  const nextActivityHref = isSupportedActivity(next) ? `${moduleHref}/activities/${next.id}` : undefined;

  return (
    <SiteShell variant="lesson" trail={[
      { label: course.title, href: `/courses/${course.id}` },
      { label: courseModule.title, href: moduleHref },
      { label: atom.title, href: `/courses/${course.id}/modules/${courseModule.id}/activities/${atom.id}` },
    ]}>
      <ActivitySidebar atom={atom} atoms={atoms} moduleHref={moduleHref} />
      {atom.type === "video"
        ? <VideoLesson atom={atom} atoms={atoms} moduleHref={moduleHref} />
        : atom.id === "eng-ss-fragments-act-practice"
          ? <ActSentencePractice questions={getActSentenceQuestions()} moduleHref={moduleHref} nextActivityHref={nextActivityHref} />
          : atom.id === "eng-ss-separator-practice"
            ? <SeparatorPractice moduleHref={moduleHref} nextActivityHref={nextActivityHref} />
            : <SentencePractice moduleHref={moduleHref} nextActivityHref={nextActivityHref} />}
    </SiteShell>
  );
}
