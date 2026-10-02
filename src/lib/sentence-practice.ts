import { sentenceAnatomyPractice, type SentenceProblem, words } from "../data/custom-practice.ts";

export type CompletenessChoice = "complete" | "fragment" | null;
export type MissingChoice = "subject" | "main verb" | "both" | null;
export type SelectionMode = "subject" | "verb";

export type PracticeProgress = {
  stageIndex: number;
  group: number;
  activeSlots: number[];
  results: boolean[];
  streaks: number[][];
  retired: boolean[][];
  variantCounts: number[][];
  groupsPerStage: number[];
  attempts: number;
  choice: CompletenessChoice;
  missing: MissingChoice;
  subject: number[];
  verb: number | null;
  selectionMode: SelectionMode;
  solved: boolean;
  firstTryCredit: boolean;
  announcement: string | null;
};

const slots = sentenceAnatomyPractice.stages.map((stage) => stage.slots.length);

export function initialProgress(): PracticeProgress {
  return {
    stageIndex: 0,
    group: 1,
    activeSlots: Array.from({ length: slots[0] }, (_, index) => index),
    results: [],
    streaks: slots.map((count) => Array(count).fill(0)),
    retired: slots.map((count) => Array(count).fill(false)),
    variantCounts: slots.map((count) => Array(count).fill(0)),
    groupsPerStage: slots.map(() => 0),
    attempts: 0,
    choice: null,
    missing: null,
    subject: [],
    verb: null,
    selectionMode: "subject",
    solved: false,
    firstTryCredit: false,
    announcement: null,
  };
}

export function currentProblem(progress: PracticeProgress): SentenceProblem | null {
  const stage = sentenceAnatomyPractice.stages[progress.stageIndex];
  if (!stage) return null;
  const slot = progress.activeSlots[progress.results.length];
  if (slot === undefined) return null;
  const variants = stage.slots[slot];
  return variants[progress.variantCounts[progress.stageIndex][slot] % variants.length];
}

export function answerIsCorrect(progress: PracticeProgress, problem: SentenceProblem): boolean {
  const stage = sentenceAnatomyPractice.stages[progress.stageIndex];
  if (stage.checkCompleteness) {
    const missing = missingSentencePart(problem);
    if (missing) {
      return progress.choice === "fragment" && progress.missing === missing;
    }
    if (progress.choice !== "complete") return false;
  }
  return problem.verb === progress.verb &&
    progress.subject.length === problem.subject.length &&
    progress.subject.every((index) => problem.subject.includes(index));
}

export function submitAnswer(progress: PracticeProgress, problem: SentenceProblem): PracticeProgress {
  if (progress.solved || progress.attempts >= 3) return progress;
  const correct = answerIsCorrect(progress, problem);
  return {
    ...progress,
    attempts: progress.attempts + 1,
    solved: correct || progress.attempts === 2,
    firstTryCredit: correct && progress.attempts === 0,
    announcement: null,
  };
}

export function missingSentencePart(problem: SentenceProblem): MissingChoice {
  if (problem.subject.length === 0) return problem.verb === undefined ? "both" : "subject";
  return problem.verb === undefined ? "main verb" : null;
}

export function answerExplanation(problem: SentenceProblem): string {
  const tokens = words(problem).map((token) => token.replace(/[.,!?;:]$/, ""));
  const subject = problem.subject.map((index) => tokens[index]).join(" ");
  const missing = missingSentencePart(problem);
  if (missing === "both") {
    return "This phrase gives extra detail, but it has neither a subject nor a main verb for an independent clause. Both are missing.";
  }
  if (problem.verb !== undefined) {
    const verb = tokens[problem.verb];
    if (missing === "subject") {
      return `The word to mark as the main verb is “${verb}”, but this statement does not say who or what it is about. The subject is missing. It is a fragment.`;
    }
    return `“${subject}” is the subject, and “${verb}” is the main verb to mark in this activity. The sentence is complete.`;
  }
  if (problem.fragmentReason === "ing") {
    return `“${subject}” is the subject, but the -ing form cannot serve as the main verb by itself. Add a helping verb or change the verb form to complete the sentence.`;
  }
  if (problem.fragmentReason === "dependent") {
    return `The introductory dependent clause has its own subject, “${subject}”, and a verb, but it cannot stand alone. An independent clause is missing. Choose Main verb here because there is no independent clause's main verb.`;
  }
  return `“${subject}” is the subject, but the verb inside the relative clause only describes that subject. The independent clause's main verb is missing.`;
}

function resetAnswer(progress: PracticeProgress): PracticeProgress {
  return {
    ...progress,
    attempts: 0,
    choice: null,
    missing: null,
    subject: [],
    verb: null,
    selectionMode: "subject",
    solved: false,
    firstTryCredit: false,
    announcement: null,
  };
}

export function advanceProgress(progress: PracticeProgress): PracticeProgress {
  const stageIndex = progress.stageIndex;
  const slot = progress.activeSlots[progress.results.length];
  if (slot === undefined || !progress.solved) return progress;

  const variantCounts = progress.variantCounts.map((row) => [...row]);
  variantCounts[stageIndex][slot] += 1;
  const results = [...progress.results, progress.firstTryCredit];
  if (results.length < progress.activeSlots.length) {
    return resetAnswer({ ...progress, results, variantCounts });
  }

  const streaks = progress.streaks.map((row) => [...row]);
  const retired = progress.retired.map((row) => [...row]);
  progress.activeSlots.forEach((activeSlot, index) => {
    streaks[stageIndex][activeSlot] = results[index] ? streaks[stageIndex][activeSlot] + 1 : 0;
    if (streaks[stageIndex][activeSlot] >= 3) retired[stageIndex][activeSlot] = true;
  });
  const groupsPerStage = [...progress.groupsPerStage];
  groupsPerStage[stageIndex] += 1;
  const firstTryTotal = results.filter(Boolean).length + progress.retired[stageIndex].filter(Boolean).length;
  if (firstTryTotal >= 5) {
    const nextStage = stageIndex + 1;
    return resetAnswer({
      ...progress,
      stageIndex: nextStage,
      group: 1,
      activeSlots: nextStage < slots.length ? Array.from({ length: slots[nextStage] }, (_, index) => index) : [],
      results: [],
      streaks,
      retired,
      variantCounts,
      groupsPerStage,
      announcement: null,
    });
  }
  const activeSlots = retired[stageIndex].flatMap((value, index) => value ? [] : [index]);
  const next = resetAnswer({
    ...progress,
    group: progress.group + 1,
    activeSlots,
    results: [],
    streaks,
    retired,
    variantCounts,
    groupsPerStage,
  });
  return { ...next, announcement: `You earned ${firstTryTotal} of 6 first-try credits. Try a new group to reach 5 of 6.` };
}

export function isStoredProgress(value: unknown): value is PracticeProgress {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<PracticeProgress>;
  return Number.isInteger(candidate.stageIndex) && candidate.stageIndex! >= 0 && candidate.stageIndex! <= slots.length &&
    Array.isArray(candidate.activeSlots) && Array.isArray(candidate.results) &&
    Array.isArray(candidate.streaks) && Array.isArray(candidate.retired) &&
    Array.isArray(candidate.variantCounts) && Array.isArray(candidate.groupsPerStage) &&
    typeof candidate.group === "number" && typeof candidate.attempts === "number" &&
    Array.isArray(candidate.subject) && typeof candidate.solved === "boolean";
}
