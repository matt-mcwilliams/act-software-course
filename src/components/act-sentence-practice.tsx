"use client";

import Link from "next/link";
import { ActivityNavigation } from "@/components/activity-navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { ActOption, ActSentenceQuestion } from "@/data/act-sentence-practice";
import { freshActProgress, restoreActProgress, submitActAnswer, type ActProgress } from "@/lib/act-sentence-practice";

const storageKey = "act-prep:act-sentence-practice:v1";
const subscribe = () => () => {};
const browserSnapshot = () => true;
const serverSnapshot = () => false;

function loadProgress(length: number): ActProgress {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) return restoreActProgress(JSON.parse(raw), length);
  } catch {
    // The activity remains usable without browser storage.
  }
  return freshActProgress(length);
}

export function ActSentencePractice({ questions, moduleHref, nextActivityHref }: { questions: ActSentenceQuestion[]; moduleHref: string; nextActivityHref?: string }) {
  const hydrated = useSyncExternalStore(subscribe, browserSnapshot, serverSnapshot);
  const [progress, setProgress] = useState<ActProgress>(() => typeof window === "undefined" ? freshActProgress(questions.length) : loadProgress(questions.length));
  const [selected, setSelected] = useState<ActOption | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      // This visit can continue without saved progress.
    }
  }, [hydrated, progress]);

  if (!hydrated) return <section className="act-practice"><p>Loading ACT practice…</p></section>;

  const score = progress.answers.reduce<number>((total, answer, index) => total + (answer === questions[index].correctOption ? 1 : 0), 0);
  if (progress.index >= questions.length) {
    return <section className="act-practice" aria-labelledby="act-practice-title">
      <header className="act-practice-header"><h1 id="act-practice-title">ACT Practice: Fragments</h1></header>
      <div className="act-practice-card act-practice-finish">
        <p className="act-practice-meta">Practice complete</p>
        <h2>{score} of {questions.length} correct within two tries</h2>
        <p>Review the subject, main verb, and alternatives for each question. This practice total is not an ACT score.</p>
        <ol className="act-practice-results">{questions.map((question, index) => <li key={question.id}><div><span>{question.source}</span><details><summary>Review explanation</summary><p>{question.explanation}</p></details></div><strong>{progress.answers[index] === question.correctOption ? progress.firstMisses[index] ? "Correct on retry" : "Correct on first try" : `Answer: ${question.correctOption}`}</strong></li>)}</ol>
        <div className="act-practice-actions"><button type="button" onClick={() => { setProgress(freshActProgress(questions.length)); setSelected(null); }}>Practice again</button><Link href={moduleHref}>Back to module</Link></div>
      </div>
      <ActivityNavigation nextHref={nextActivityHref} />
    </section>;
  }

  const question = questions[progress.index];
  const checkedAnswer = progress.answers[progress.index];
  const checked = checkedAnswer !== null;
  const choice = checked ? checkedAnswer : selected;
  const correct = checkedAnswer === question.correctOption;
  const retrying = !checked && progress.firstMisses[progress.index] !== null;

  function checkAnswer() {
    if (!selected || checked) return;
    setProgress((current) => submitActAnswer(current, selected, question.correctOption));
    setSelected(null);
  }

  function continuePractice() {
    setProgress((current) => ({ ...current, index: current.index + 1 }));
    setSelected(null);
  }

  return <section className="act-practice" aria-labelledby="act-practice-title">
    <header className="act-practice-header">
      <h1 id="act-practice-title">ACT Practice: Fragments</h1>
      <p>Read each choice in the whole sentence. Find the subject and main verb of the clause that can stand on its own. You have two tries per question.</p>
    </header>
    <div className="act-practice-toolbar"><span>Question {progress.index + 1} of {questions.length}</span></div>
    <article className="act-practice-card" aria-labelledby="act-question-stem">
      <div className="act-practice-source"><span>{question.passageTitle}</span><span>{question.source}</span></div>
      <p className="act-practice-excerpt">{question.before} <mark>{question.target}</mark> {question.after}</p>
      <fieldset className="act-practice-choices" disabled={checked}>
        <legend id="act-question-stem">{question.stem}</legend>
        {question.choices.map(({ label, text }) => <label key={label} className={choice === label ? "is-selected" : ""}>
          <input type="radio" name="act-choice" value={label} checked={choice === label} onChange={() => setSelected(label)} />
          <span className="act-practice-choice-label">{label}.</span>
          <span>{text}</span>
        </label>)}
      </fieldset>
      {retrying && <div className="act-practice-feedback" role="status">
        <strong className="is-incorrect">Try again.</strong>
        <p>That choice is incorrect. Read it in the whole sentence again: does the subject have a main verb in a clause that can stand on its own? You have one more try.</p>
      </div>}
      {checked && <div className="act-practice-feedback" role="status">
        <strong className={correct ? "is-correct" : "is-incorrect"}>{correct ? "Correct." : `The correct answer is ${question.correctOption}.`}</strong>
        <p>{question.explanation}</p>
      </div>}
      <div className="act-practice-actions">{checked
        ? <button type="button" onClick={continuePractice}>{progress.index === questions.length - 1 ? "See results" : "Next question"}</button>
        : <button type="button" disabled={!selected} onClick={checkAnswer}>Check answer</button>}
      </div>
    </article>
    <ActivityNavigation nextHref={nextActivityHref} />
  </section>;
}
