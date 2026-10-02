import type { ActOption } from "../data/act-sentence-practice";

export type ActProgress = {
  index: number;
  answers: (ActOption | null)[];
  firstMisses: (ActOption | null)[];
};

const options: ActOption[] = ["A", "B", "C", "D"];

export function freshActProgress(length: number): ActProgress {
  return { index: 0, answers: Array(length).fill(null), firstMisses: Array(length).fill(null) };
}

export function restoreActProgress(value: unknown, length: number): ActProgress {
  if (value && typeof value === "object") {
    const saved = value as Partial<ActProgress>;
    const validAnswers = (answers: unknown): answers is (ActOption | null)[] =>
      Array.isArray(answers) && answers.length === length &&
      answers.every((answer) => answer === null || options.includes(answer));

    if (Number.isInteger(saved.index) && saved.index! >= 0 && saved.index! <= length &&
      validAnswers(saved.answers) &&
      (saved.firstMisses === undefined || validAnswers(saved.firstMisses))) {
      return {
        index: saved.index!,
        answers: saved.answers,
        firstMisses: saved.firstMisses ?? Array(length).fill(null),
      };
    }
  }
  return freshActProgress(length);
}

export function submitActAnswer(progress: ActProgress, selected: ActOption, correctOption: ActOption): ActProgress {
  const index = progress.index;
  if (index >= progress.answers.length || progress.answers[index] !== null) return progress;

  if (selected !== correctOption && progress.firstMisses[index] === null) {
    return { ...progress, firstMisses: progress.firstMisses.map((answer, position) => position === index ? selected : answer) };
  }

  return { ...progress, answers: progress.answers.map((answer, position) => position === index ? selected : answer) };
}
