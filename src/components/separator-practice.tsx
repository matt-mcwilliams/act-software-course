"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ActivityNavigation } from "@/components/activity-navigation";
import { separatorQuestions, type SeparatorQuestion } from "@/data/separator-practice";
import { canCheckSeparator, emptyAnswer, freshSeparatorProgress, gradeSeparator, isColon, requiredCores, restoreSeparatorProgress, type CoreField, type SeparatorAnswer, type SeparatorProgress } from "@/lib/separator-practice";

const storageKey = "act-prep:separator-practice:v1";
const subscribe = () => () => {};
const browserSnapshot = () => true;
const serverSnapshot = () => false;
const fieldLabels: Record<CoreField, string> = { leftSubject: "Left subject", leftVerb: "Left main verb", rightSubject: "Right subject", rightVerb: "Right main verb" };
function loadProgress() {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) return restoreSeparatorProgress(JSON.parse(raw), separatorQuestions);
  } catch { /* Practice works when browser storage is unavailable. */ }
  return freshSeparatorProgress(separatorQuestions.length);
}
function explanation(question: SeparatorQuestion) {
  if (question.kind === "recall") return `The three allowed choices here are ${question.options.filter((option) => question.correct.includes(option.id)).map((option) => option.label).join(", ")}. These are the separator types used in this practice.`;
  if (question.kind === "written") return "Your response is saved for review. This written question is not graded.";
  return question.explanation;
}

export function SeparatorPractice({ moduleHref, nextActivityHref }: { moduleHref: string; nextActivityHref?: string }) {
  const hydrated = useSyncExternalStore(subscribe, browserSnapshot, serverSnapshot);
  const [progress, setProgress] = useState<SeparatorProgress>(() => typeof window === "undefined" ? freshSeparatorProgress(separatorQuestions.length) : loadProgress());
  const [editingCore, setEditingCore] = useState<CoreField | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(storageKey, JSON.stringify(progress)); } catch { /* Keep this visit usable without storage. */ }
  }, [hydrated, progress]);
  useEffect(() => { if (hydrated && progress.started) heading.current?.focus(); }, [hydrated, progress.started, progress.index]);

  function update(patch: Partial<SeparatorAnswer>) { setProgress((current) => ({ ...current, draft: { ...current.draft, ...patch } })); }
  function reset() {
    if (window.confirm("Start Separator Practice over? Your saved answers will be cleared.")) {
      setProgress(freshSeparatorProgress(separatorQuestions.length));
      setEditingCore(null);
    }
  }
  if (!hydrated) return <section className="sentence-practice"><p>Loading practice…</p></section>;
  if (!progress.started) return <section className="sentence-practice practice-splash" aria-labelledby="separator-title">
    <header className="practice-header"><h1 id="separator-title">Separator Practice</h1></header>
    <p className="practice-preview">Learn which separators connect ideas, find the sentence cores on either side, and decide whether the whole sentence works. You’ll move from guided examples to decisions on your own in one continuous practice. A short written recall is saved without grading.</p>
    <div className="practice-actions"><button className="practice-start" type="button" onClick={() => setProgress({ ...progress, started: true })}>Let’s go<ArrowRight size={18} aria-hidden="true" /></button></div>
  </section>;

  const question = separatorQuestions[progress.index];
  if (!question) {
    const correct = progress.answers.reduce((total, answer, index) => total + (answer && gradeSeparator(separatorQuestions[index], answer) === true ? 1 : 0), 0);
    return <section className="sentence-practice separator-practice" aria-labelledby="separator-title">
      <header className="practice-header"><h1 id="separator-title" ref={heading} tabIndex={-1}>Separator Practice</h1></header>
      <div className="practice-card practice-finish"><p className="practice-status">Practice complete</p><h2>{correct} of {separatorQuestions.length - 1} graded questions correct</h2><p>Your written recall is saved below and is not included in the score. Review any question to see its explanation.</p>
        <ol className="separator-results">{separatorQuestions.map((item, index) => {
          const answer = progress.answers[index]!;
          const result = gradeSeparator(item, answer);
          return <li key={item.id}><details><summary><span>{index + 1}. {"tokens" in item ? sentenceText(item.tokens) : item.prompt}</span><strong>{result === null ? "Ungraded" : result ? "Correct" : "Incorrect"}</strong></summary>{item.kind === "written" && <p className="separator-written-review">{answer.written}</p>}<p>{explanation(item)}</p></details></li>;
        })}</ol>
        <div className="practice-actions"><Link href={moduleHref}>Back to module</Link><button type="button" onClick={() => { setProgress(freshSeparatorProgress(separatorQuestions.length)); setEditingCore(null); }}>Practice again</button></div>
      </div><ActivityNavigation nextHref={nextActivityHref} />
    </section>;
  }
  const checkedAnswer = progress.answers[progress.index];
  const checked = checkedAnswer !== null;
  const answer = checkedAnswer ?? progress.draft;
  const sentenceQuestion = "tokens" in question ? question : null;
  const guided = sentenceQuestion && question.kind !== "binary" && (question.kind === "find" || answer.complete === true);
  const fields = sentenceQuestion ? requiredCores(sentenceQuestion, answer) : [];
  const activeCore = editingCore ?? fields.find((field) => answer[field] === null) ?? null;
  const colon = sentenceQuestion && isColon(sentenceQuestion, answer);
  const result = checked ? gradeSeparator(question, answer) : null;
  const prompt = question.kind === "recall" || question.kind === "written" ? question.prompt : question.kind === "find" ? "Find the separator." : "Is this a complete sentence?";

  function chooseToken(index: number) {
    if (checked || !guided || !sentenceQuestion) return;
    if (answer.separator === null) {
      update({ separator: index, leftSubject: null, leftVerb: null, rightSubject: null, rightVerb: null, removed: null });
      setEditingCore(null);
    } else if (activeCore) {
      update({ [activeCore]: index });
      setEditingCore(null);
    }
  }
  function check() {
    if (!canCheckSeparator(question, answer) || checked) return;
    setProgress((current) => ({ ...current, answers: current.answers.map((old, index) => index === current.index ? current.draft : old) }));
    setEditingCore(null);
  }

  return <section className="sentence-practice separator-practice" aria-labelledby="separator-title">
    <header className="practice-header"><h1 id="separator-title" ref={heading} tabIndex={-1}>Separator Practice</h1></header>
    <div className="practice-toolbar"><span>Question {progress.index + 1} of {separatorQuestions.length}</span><button type="button" onClick={reset}>Start over</button></div>
    <progress className="separator-progress" value={progress.index} max={separatorQuestions.length} aria-label="Questions completed" />
    <div className="practice-card">
      <p className="practice-prompt" id="separator-prompt">{prompt}</p>
      {question.kind === "recall" && <><p className="practice-guidance">Select exactly three.</p><fieldset className="practice-choices separator-options" disabled={checked}><legend className="separator-sr-only">Allowed separator types</legend>{question.options.map((option) => <label key={option.id}><input type="checkbox" checked={answer.options.includes(option.id)} disabled={!answer.options.includes(option.id) && answer.options.length === 3} onChange={() => update({ options: answer.options.includes(option.id) ? answer.options.filter((id) => id !== option.id) : [...answer.options, option.id] })} />{option.label}</label>)}</fieldset></>}
      {question.kind === "written" && <><p className="practice-guidance" id="written-help">This response is ungraded. Write the four types in your own words.</p><label className="separator-sr-only" htmlFor="separator-recall">Your separator types</label><textarea id="separator-recall" className="separator-written" aria-describedby="written-help" rows={5} value={answer.written} disabled={checked} onChange={(event) => update({ written: event.target.value })} /></>}
      {sentenceQuestion && <>
        <div className="practice-sentence-row"><div className="practice-sentence separator-sentence" aria-label={sentenceText(sentenceQuestion.tokens)}>{sentenceQuestion.tokens.map((token, index) => {
          const subject = checked ? (sentenceQuestion.left.independent && sentenceQuestion.left.subject === index) || (!colon && sentenceQuestion.right.independent && sentenceQuestion.right.subject === index) : answer.leftSubject === index || answer.rightSubject === index;
          const verb = checked ? (sentenceQuestion.left.independent && sentenceQuestion.left.verb === index) || (!colon && sentenceQuestion.right.independent && sentenceQuestion.right.verb === index) : answer.leftVerb === index || answer.rightVerb === index;
          const selectedSeparator = checked ? answer.complete !== false && sentenceQuestion.separator === index : answer.separator === index;
          const enabled = guided && !checked && (answer.separator === null || (activeCore !== null && (activeCore.startsWith("left") ? index < answer.separator : index > answer.separator) && /[\p{L}\p{N}]/u.test(token)));
          const className = `${subject ? "is-subject" : verb ? "is-verb" : ""} ${selectedSeparator ? "is-separator" : ""} ${/^[.,;:!?]/.test(token) ? "separator-punctuation" : ""}`;
          return guided && !checked ? <button key={index} type="button" disabled={!enabled} className={className} aria-pressed={subject || verb || selectedSeparator} aria-label={`${token}, word ${index + 1}${selectedSeparator ? ", selected separator" : subject ? ", subject" : verb ? ", main verb" : ""}`} onClick={() => chooseToken(index)}>{token}</button> : <span key={index} className={className}>{token}</span>;
        })}</div></div>
        {question.kind !== "find" && <fieldset className="practice-choices" disabled={checked}><legend className="separator-sr-only">Is this a complete sentence?</legend>{[true, false].map((value) => <label key={String(value)}><input type="radio" name="separator-complete" checked={answer.complete === value} onChange={() => { update({ ...emptyAnswer(), complete: value }); setEditingCore(null); }} />{value ? "Yes" : "No"}</label>)}</fieldset>}
        {guided && !checked && <>
          <p className="practice-guidance" aria-live="polite">{answer.separator === null ? "Click the separator that connects the two parts. Choose a comma and its conjunction together when they form one separator." : activeCore ? `Find the ${activeCore.startsWith("left") ? "left" : "right"} side’s ${activeCore.endsWith("Subject") ? "subject" : "main verb"}. Select its core noun or pronoun, or the first word of its main verb.` : colon ? "Now check what happens with the colon removed." : "Both cores are marked. Check your answer when you’re ready."}</p>
          {answer.separator !== null && <div className="separator-proof"><div className="separator-selection"><span>Separator: <strong>{sentenceQuestion.tokens[answer.separator]}</strong></span><button type="button" onClick={() => { update({ separator: null, leftSubject: null, leftVerb: null, rightSubject: null, rightVerb: null, removed: null }); setEditingCore(null); }}>Change separator</button></div>
            <div className="separator-cores">{fields.map((field) => <button type="button" key={field} className={`${field.endsWith("Subject") ? "is-subject" : "is-verb"} ${activeCore === field ? "is-active" : ""}`} aria-pressed={activeCore === field} onClick={() => setEditingCore(field)}><span>{fieldLabels[field]}</span><strong>{answer[field] === null ? "___" : sentenceQuestion.tokens[answer[field]]}</strong></button>)}</div>
            {colon && <fieldset className="practice-choices"><legend>Could the sentence stand with the colon removed?</legend>{[true, false].map((value) => <label key={String(value)}><input type="radio" name="colon-removed" checked={answer.removed === value} onChange={() => update({ removed: value })} />{value ? "Yes" : "No"}</label>)}</fieldset>}
          </div>}
        </>}
      </>}
      {checked && <div className="practice-feedback" role="status"><strong className={result === null ? "" : result ? "separator-correct" : "separator-incorrect"}>{result === null ? "Response saved — ungraded." : result ? "Correct." : "Incorrect."}</strong>{colon && answer.removed === true && <p>A sentence that stands with the colon removed is incorrect in this practice. The colon must follow a complete statement and introduce an explanation or expansion.</p>}<p>{explanation(question)}</p></div>}
      <div className="practice-actions">{checked ? <button type="button" onClick={() => { setProgress({ ...progress, index: progress.index + 1, draft: emptyAnswer() }); setEditingCore(null); }}>{progress.index === separatorQuestions.length - 1 ? "See results" : "Continue"}</button> : <button type="button" disabled={!canCheckSeparator(question, answer)} onClick={check}>{question.kind === "written" ? "Save response" : "Check answer"}</button>}</div>
    </div><ActivityNavigation nextHref={nextActivityHref} />
  </section>;
}

function sentenceText(tokens: string[]) { return tokens.join(" ").replace(/\s+([.,;:!?])/g, "$1"); }
