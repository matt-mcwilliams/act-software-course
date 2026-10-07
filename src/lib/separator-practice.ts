import type { SeparatorQuestion, SentenceQuestion } from "../data/separator-practice.ts";

export const coreFields = ["leftSubject", "leftVerb", "rightSubject", "rightVerb"] as const;
export type CoreField = typeof coreFields[number];
export type SeparatorAnswer = {
  options: string[];
  written: string;
  complete: boolean | null;
  separator: number | null;
  leftSubject: number | null;
  leftVerb: number | null;
  rightSubject: number | null;
  rightVerb: number | null;
  removed: boolean | null;
};
export type SeparatorProgress = { started: boolean; index: number; answers: (SeparatorAnswer | null)[]; draft: SeparatorAnswer };
export const emptyAnswer = (): SeparatorAnswer => ({ options: [], written: "", complete: null, separator: null, leftSubject: null, leftVerb: null, rightSubject: null, rightVerb: null, removed: null });
export const freshSeparatorProgress = (length: number): SeparatorProgress => ({ started: false, index: 0, answers: Array(length).fill(null), draft: emptyAnswer() });
export function isColon(question: SentenceQuestion, answer: SeparatorAnswer) { return answer.separator !== null && question.tokens[answer.separator] === ":"; }
export function requiredCores(question: SentenceQuestion, answer: SeparatorAnswer): readonly CoreField[] { return isColon(question, answer) ? coreFields.slice(0, 2) : coreFields; }
export function canCheckSeparator(question: SeparatorQuestion, answer: SeparatorAnswer): boolean {
  if (question.kind === "recall") return answer.options.length === 3;
  if (question.kind === "written") return answer.written.trim().length > 0;
  if (question.kind !== "find" && answer.complete === null) return false;
  if (question.kind === "binary" || (question.kind === "guided" && answer.complete === false)) return true;
  return answer.separator !== null && requiredCores(question, answer).every((field) => answer[field] !== null) && (!isColon(question, answer) || answer.removed !== null);
}
export function gradeSeparator(question: SeparatorQuestion, answer: SeparatorAnswer): boolean | null {
  if (!canCheckSeparator(question, answer)) return false;
  if (question.kind === "written") return null;
  if (question.kind === "recall") return answer.options.length === question.correct.length && question.correct.every((id) => answer.options.includes(id));
  if (question.kind === "binary" || answer.complete === false) return answer.complete === question.complete;
  if (!question.complete || answer.separator !== question.separator || !question.left.independent) return false;
  if (answer.leftSubject !== question.left.subject || answer.leftVerb !== question.left.verb) return false;
  return isColon(question, answer) ? answer.removed === false : question.right.independent && answer.rightSubject === question.right.subject && answer.rightVerb === question.right.verb;
}
export function restoreSeparatorProgress(value: unknown, questions: SeparatorQuestion[]): SeparatorProgress {
  const fresh = freshSeparatorProgress(questions.length);
  if (!value || typeof value !== "object") return fresh;
  const saved = value as Partial<SeparatorProgress>;
  function validAnswer(value: unknown, question: SeparatorQuestion): value is SeparatorAnswer {
    if (!value || typeof value !== "object") return false;
    const answer = value as SeparatorAnswer;
    const nullableBoolean = (value: unknown) => value === null || typeof value === "boolean";
    const limit = "tokens" in question ? question.tokens.length : 0;
    const validIndex = (value: unknown) => value === null || (typeof value === "number" && Number.isInteger(value) && value >= 0 && value < limit);
    return Array.isArray(answer.options) && answer.options.length <= 3 && new Set(answer.options).size === answer.options.length && answer.options.every((id) => question.kind === "recall" && question.options.some((option) => option.id === id)) && typeof answer.written === "string" && nullableBoolean(answer.complete) && nullableBoolean(answer.removed) && validIndex(answer.separator) && coreFields.every((field) => validIndex(answer[field]));
  }
  if (typeof saved.started !== "boolean" || !Number.isInteger(saved.index) || saved.index! < 0 || saved.index! > questions.length || !Array.isArray(saved.answers) || saved.answers.length !== questions.length) return fresh;
  if (!saved.answers.every((answer, index) => index < saved.index! ? validAnswer(answer, questions[index]) && canCheckSeparator(questions[index], answer) : index === saved.index ? answer === null || (validAnswer(answer, questions[index]) && canCheckSeparator(questions[index], answer)) : answer === null)) return fresh;
  if (!validAnswer(saved.draft, questions[Math.min(saved.index!, questions.length - 1)])) return fresh;
  return saved as SeparatorProgress;
}
