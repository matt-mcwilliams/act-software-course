"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { sentenceAnatomyPractice, words } from "@/data/custom-practice";
import {
  advanceProgress,
  answerExplanation,
  answerIsCorrect,
  currentProblem,
  initialProgress,
  isStoredProgress,
  submitAnswer,
  type PracticeProgress,
} from "@/lib/sentence-practice";

const storageKey = "act-prep:sentence-anatomy:v1";
const hintOne = "Who or what is this about? Which word tells what that subject does or is in the independent clause?";
const hintTwo = "Choose only the subject noun or pronoun, without an article. A main verb needs a finite form; -ing alone and verbs inside who or that clauses do not count.";

function tryLoad(): PracticeProgress {
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (isStoredProgress(parsed)) return parsed;
    }
  } catch {
    // Practice still works if browser storage is unavailable.
  }
  return initialProgress();
}

function subscribeToHydration() {
  return () => {};
}

function browserSnapshot() {
  return true;
}

function serverSnapshot() {
  return false;
}

export function SentencePractice({ moduleHref }: { moduleHref: string }) {
  const hydrated = useSyncExternalStore(subscribeToHydration, browserSnapshot, serverSnapshot);
  const [progress, setProgress] = useState<PracticeProgress>(() => typeof window === "undefined" ? initialProgress() : tryLoad());

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      // The current visit can continue without saved progress.
    }
  }, [hydrated, progress]);

  if (!hydrated) return <section className="sentence-practice"><p>Loading practice…</p></section>;

  const stage = sentenceAnatomyPractice.stages[progress.stageIndex];
  if (!stage) {
    return <section className="sentence-practice" aria-labelledby="practice-title">
      <header className="practice-header"><p className="practice-eyebrow">Custom practice</p><h1 id="practice-title">Sentence anatomy</h1></header>
      <div className="practice-card practice-finish">
        <p className="practice-status">Practice complete</p>
        <h2>You found the sentence core.</h2>
        <p>You reached at least five first-try credits in each of the four stages.</p>
        <ol className="practice-summary">{sentenceAnatomyPractice.stages.map((item, index) => <li key={item.title}><span>{item.title}</span><span>{progress.groupsPerStage[index]} {progress.groupsPerStage[index] === 1 ? "group" : "groups"}</span></li>)}</ol>
        <div className="practice-actions"><Link href={moduleHref}>Back to module</Link><button type="button" onClick={() => setProgress(initialProgress())}>Practice again</button></div>
      </div>
    </section>;
  }

  const problem = currentProblem(progress);
  if (!problem) return null;
  const tokens = words(problem);
  const slot = progress.activeSlots[progress.results.length];
  const complete = problem.verb !== undefined;
  const canSubmit = stage.checkCompleteness
    ? progress.choice === "fragment" ? progress.missing !== null : progress.choice === "complete" && progress.subject.length > 0 && progress.verb !== null
    : progress.subject.length > 0 && progress.verb !== null;
  const selectedWordMode = !stage.checkCompleteness || progress.choice === "complete";

  function chooseWord(index: number) {
    if (progress.solved) return;
    setProgress((current) => {
      if (current.subject.includes(index)) return { ...current, subject: [], verb: null, selectionMode: "subject" };
      if (current.selectionMode === "verb") return { ...current, verb: current.verb === index ? null : index };
      return { ...current, subject: [index], selectionMode: "verb" };
    });
  }

  function submit() {
    if (!canSubmit || progress.solved) return;
    setProgress(submitAnswer(progress, problem!));
  }

  function reset() {
    if (window.confirm("Start this practice over from stage 1?")) setProgress(initialProgress());
  }

  const answerVisible = progress.solved;
  const answeredCorrectly = progress.solved && answerIsCorrect(progress, problem);

  return <section className="sentence-practice" aria-labelledby="practice-title">
    <header className="practice-header">
      <h1 id="practice-title">{stage.title}</h1>
      <p>{stage.instruction}</p>
    </header>
    <div className="practice-toolbar">
      <ol className="practice-steps" aria-label="Difficulty slots">{stage.slots.map((_, index) => {
        const retired = progress.retired[progress.stageIndex][index];
        const previousIndex = progress.activeSlots.indexOf(index);
        const completed = previousIndex >= 0 && previousIndex < progress.results.length;
        const current = index === slot;
        return <li key={index} className={retired ? "is-retired" : current ? "is-current" : completed ? progress.results[previousIndex] ? "is-correct" : "is-missed" : ""} aria-current={current ? "step" : undefined} aria-label={`Level ${index + 1}${retired ? ", mastered" : current ? ", current" : completed ? progress.results[previousIndex] ? ", first try correct" : ", practiced" : ""}`}>{index + 1}</li>;
      })}</ol>
      <button type="button" onClick={reset}>Start over</button>
    </div>
    {progress.announcement && <p className="practice-announcement" role="status">{progress.announcement}</p>}
    <div className="practice-card">
      <p className="practice-status">Level {slot + 1} · Problem {progress.results.length + 1} of {progress.activeSlots.length}</p>
      <p className="practice-prompt" aria-live="polite">{stage.checkCompleteness && progress.choice === null ? "Is this a complete sentence?" : progress.choice === "fragment" ? "What is missing?" : progress.subject.length ? "Find the main verb." : "Find the subject."}</p>
      <div className="practice-sentence" aria-label={problem.text}>
        {tokens.map((word, index) => {
          const markedSubject = answerVisible ? problem.subject.includes(index) : progress.subject.includes(index);
          const markedVerb = answerVisible ? problem.verb === index : progress.verb === index;
          return selectedWordMode || answerVisible
            ? <button key={index} type="button" onClick={() => chooseWord(index)} disabled={answerVisible || (stage.checkCompleteness && progress.choice !== "complete")} className={markedSubject ? "is-subject" : markedVerb ? "is-verb" : ""} aria-pressed={markedSubject || markedVerb} aria-label={`${word} ${markedSubject ? "subject" : markedVerb ? "main verb" : "unmarked"}`}>{word}</button>
            : <span key={index}>{word}</span>;
        })}
      </div>
      {stage.checkCompleteness && !answerVisible && <fieldset className="practice-choices"><legend>Choose one</legend><label><input type="radio" name="completeness" checked={progress.choice === "complete"} onChange={() => setProgress({ ...progress, choice: "complete", missing: null, subject: [], verb: null, selectionMode: "subject" })} />Complete</label><label><input type="radio" name="completeness" checked={progress.choice === "fragment"} onChange={() => setProgress({ ...progress, choice: "fragment", subject: [], verb: null, selectionMode: "subject" })} />Fragment</label></fieldset>}
      {stage.checkCompleteness && progress.choice === "fragment" && !answerVisible && <fieldset className="practice-choices"><legend>What is missing?</legend>{(["subject", "main verb", "both"] as const).map((option) => <label key={option}><input type="radio" name="missing" checked={progress.missing === option} onChange={() => setProgress({ ...progress, missing: option })} />{option === "both" ? "Both" : option === "subject" ? "Subject" : "Main verb"}</label>)}</fieldset>}
      {progress.attempts > 0 && !progress.solved && <div className="practice-feedback" role="status"><strong>Try again.</strong><p>{progress.attempts === 1 ? hintOne : hintTwo}</p><p>{3 - progress.attempts} {3 - progress.attempts === 1 ? "try" : "tries"} left</p></div>}
      {answerVisible && <div className="practice-feedback" role="status"><strong>{answeredCorrectly ? progress.firstTryCredit ? "Correct on the first try." : "Correct." : "Answer revealed."}</strong><p>{answerExplanation(problem)}</p>{!complete && <p>What is missing: <strong>main verb</strong>.</p>}</div>}
      <div className="practice-actions">{answerVisible ? <button type="button" onClick={() => setProgress(advanceProgress(progress))}>Continue</button> : <button type="button" onClick={submit} disabled={!canSubmit}>Check answer</button>}</div>
    </div>
  </section>;
}
