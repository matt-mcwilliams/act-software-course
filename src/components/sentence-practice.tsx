"use client";

import Link from "next/link";
import { ActivityNavigation } from "@/components/activity-navigation";
import { ArrowRight, Undo2 } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { sentenceAnatomyPractice, words } from "@/data/custom-practice";
import {
  advanceProgress,
  answerExplanation,
  answerIsCorrect,
  currentProblem,
  initialProgress,
  missingSentencePart,
  isStoredProgress,
  submitAnswer,
  type PracticeProgress,
} from "@/lib/sentence-practice";

const storageKey = "act-prep:sentence-anatomy:v2";
const hintOne = "Who or what is this about? Does that subject have a verb in a clause that can stand on its own?";
const hintTwo = "Check the clause that can stand on its own. An -ing form alone needs a helping verb. Verbs inside who, that, which, when, or because clauses do not supply the independent clause’s main verb. When marking a complete sentence, select the core noun or pronoun and the main verb.";

function tryLoad(): { progress: PracticeProgress; started: boolean } {
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (isStoredProgress(parsed)) {
        const started = "started" in parsed && typeof parsed.started === "boolean"
          ? parsed.started
          : JSON.stringify(parsed) !== JSON.stringify(initialProgress());
        return { progress: parsed, started };
      }
    }
  } catch {
    // Practice still works if browser storage is unavailable.
  }
  return { progress: initialProgress(), started: false };
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

export function SentencePractice({ moduleHref, nextActivityHref }: { moduleHref: string; nextActivityHref?: string }) {
  const hydrated = useSyncExternalStore(subscribeToHydration, browserSnapshot, serverSnapshot);
  const [savedAttempt] = useState(() => typeof window === "undefined"
    ? { progress: initialProgress(), started: false }
    : tryLoad());
  const [started, setStarted] = useState(savedAttempt.started);
  const practiceHeading = useRef<HTMLHeadingElement>(null);
  const [progress, setProgress] = useState<PracticeProgress>(savedAttempt.progress);

  useEffect(() => {
    if (started && hydrated) practiceHeading.current?.focus();
  }, [started, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ ...progress, started }));
    } catch {
      // The current visit can continue without saved progress.
    }
  }, [hydrated, progress, started]);

  if (!hydrated) return <section className="sentence-practice"><p>Loading practice…</p></section>;

  if (!started) {
    return <section className="sentence-practice practice-splash" aria-labelledby="practice-title">
      <header className="practice-header">
        <h1 id="practice-title">Sentence Anatomy Practice</h1>
      </header>
      <p className="practice-preview">Build your ability to spot the subject and main verb at the heart of a sentence. Across four stages, you’ll move from short examples to longer sentences and decide whether each is complete or a fragment. Click words to mark the sentence core, or identify what a fragment is missing. Hints and feedback will help you improve as you go.</p>
      <div className="practice-actions"><button className="practice-start" type="button" onClick={() => setStarted(true)}>Let’s go<ArrowRight size={18} aria-hidden="true" /></button></div>
    </section>;
  }

  const stage = sentenceAnatomyPractice.stages[progress.stageIndex];
  if (!stage) {
    return <section className="sentence-practice" aria-labelledby="practice-title">
      <header className="practice-header"><h1 id="practice-title" ref={practiceHeading} tabIndex={-1}>Sentence Anatomy Practice</h1></header>
      <div className="practice-card practice-finish">
        <ol className="practice-summary">{sentenceAnatomyPractice.stages.map((item, index) => <li key={item.title}><span>{item.title}</span><span>{progress.groupsPerStage[index]} {progress.groupsPerStage[index] === 1 ? "group" : "groups"}</span></li>)}</ol>
        <div className="practice-actions"><Link href={moduleHref}>Back to module</Link><button type="button" onClick={() => { setProgress(initialProgress()); setStarted(false); }}>Practice again</button></div>
      </div>
      <ActivityNavigation nextHref={nextActivityHref} />
    </section>;
  }

  const problem = currentProblem(progress);
  if (!problem) return null;
  const tokens = words(problem);
  const slot = progress.activeSlots[progress.results.length];
  const missing = missingSentencePart(problem);
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

  function undoWord() {
    setProgress((current) => current.verb !== null
      ? { ...current, verb: null, selectionMode: "verb" }
      : { ...current, subject: [], selectionMode: "subject" });
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
      <h1 id="practice-title" ref={practiceHeading} tabIndex={-1}>{stage.title}</h1>
      {stage.instruction && <p>{stage.instruction}</p>}
    </header>
    <p className="practice-status practice-stage">Stage {progress.stageIndex + 1} of {sentenceAnatomyPractice.stages.length}</p>
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
      <p className="practice-prompt" aria-live="polite">{stage.checkCompleteness ? "Is this a complete sentence?" : progress.subject.length ? "Find the main verb." : "Find the subject."}</p>
      <div className="practice-sentence-row">
        <div className="practice-sentence" aria-label={problem.text}>
          {tokens.map((word, index) => {
            const markedSubject = answerVisible ? problem.subject.includes(index) : progress.subject.includes(index);
            const markedVerb = answerVisible ? problem.verb === index : progress.verb === index;
            return selectedWordMode || answerVisible
              ? <button key={index} type="button" onClick={() => chooseWord(index)} disabled={answerVisible || (stage.checkCompleteness && progress.choice !== "complete")} className={markedSubject ? "is-subject" : markedVerb ? "is-verb" : ""} aria-pressed={markedSubject || markedVerb} aria-label={`${word} ${markedSubject ? "subject" : markedVerb ? "main verb" : "unmarked"}`}>{word}</button>
              : <span key={index}>{word}</span>;
          })}
        </div>
        {!progress.solved && selectedWordMode && (progress.subject.length > 0 || progress.verb !== null) && <button className="practice-undo" type="button" onClick={undoWord} aria-label={`Undo ${progress.verb !== null ? "main verb" : "subject"} selection`} title="Undo last selection"><Undo2 size={20} strokeWidth={2.25} aria-hidden="true" /></button>}
      </div>
      {stage.checkCompleteness && !answerVisible && <fieldset className="practice-choices"><legend>Choose one</legend><label><input type="radio" name="completeness" checked={progress.choice === "complete"} onChange={() => setProgress({ ...progress, choice: "complete", missing: null, subject: [], verb: null, selectionMode: "subject" })} />Complete</label><label><input type="radio" name="completeness" checked={progress.choice === "fragment"} onChange={() => setProgress({ ...progress, choice: "fragment", subject: [], verb: null, selectionMode: "subject" })} />Fragment</label></fieldset>}
      {stage.checkCompleteness && progress.choice === "complete" && !answerVisible && <p className="practice-guidance" aria-live="polite">{progress.subject.length ? "Choose the main verb." : "Choose the subject."}</p>}
      {stage.checkCompleteness && progress.choice === "fragment" && !answerVisible && <fieldset className="practice-choices"><legend>What is missing?</legend>{(["subject", "main verb", "both"] as const).map((option) => <label key={option}><input type="radio" name="missing" checked={progress.missing === option} onChange={() => setProgress({ ...progress, missing: option })} />{option === "both" ? "Both" : option === "subject" ? "Subject" : "Main verb"}</label>)}</fieldset>}
      {progress.attempts > 0 && !progress.solved && <div className="practice-feedback" role="status"><strong>Try again.</strong><p>{progress.attempts === 1 ? hintOne : hintTwo}</p><p>{3 - progress.attempts} {3 - progress.attempts === 1 ? "try" : "tries"} left</p></div>}
      {answerVisible && <div className="practice-feedback" role="status"><strong>{answeredCorrectly ? progress.firstTryCredit ? "Correct on the first try." : "Correct." : "Answer revealed."}</strong><p>{answerExplanation(problem)}</p>{missing && <p>What is missing: <strong>{missing === "both" ? "subject and main verb" : missing}</strong>.</p>}</div>}
      <div className="practice-actions">{answerVisible ? <button type="button" onClick={() => setProgress(advanceProgress(progress))}>Continue</button> : <button type="button" onClick={submit} disabled={!canSubmit}>Check answer</button>}</div>
    </div>
    <ActivityNavigation nextHref={nextActivityHref} />
  </section>;
}
