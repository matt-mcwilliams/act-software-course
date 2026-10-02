import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/course-navigation";
import { VideoLesson } from "@/components/video-lesson";
import { SentencePractice } from "@/components/sentence-practice";
import { getCourseById, getModuleById } from "@/data/course-catalog";
import "@/components/video-lesson.css";
import "@/components/sentence-practice.css";

type AtomPageProps = {
  params: Promise<{ courseId: string; moduleId: string; activityId: string }>;
};

function getActivity(courseId: string, moduleId: string, activityId: string) {
  const course = getCourseById(courseId);
  const courseModule = course ? getModuleById(course, moduleId) : undefined;
  const atom = courseModule?.atoms.find((entry) => entry.id === activityId);
  if (!course || !courseModule || !atom || atom.availability !== "published" ||
    (atom.type !== "video" && atom.id !== "eng-ss-anatomy-custom-practice")) {
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
  const moduleHref = `/courses/${course.id}/modules/${courseModule.id}`;

  return (
    <SiteShell variant="lesson" trail={[
      { label: course.title, href: `/courses/${course.id}` },
      { label: courseModule.title, href: moduleHref },
      { label: atom.title, href: `/courses/${course.id}/modules/${courseModule.id}/activities/${atom.id}` },
    ]}>
      {atom.type === "video"
        ? <VideoLesson atom={atom} atoms={[...courseModule.atoms].sort((a, b) => a.order - b.order)} moduleHref={moduleHref} />
        : <SentencePractice moduleHref={moduleHref} />}
    </SiteShell>
  );
}
