"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { ActOption, ActSentenceQuestion } from "@/data/act-sentence-practice";

type Progress = { index: number; answers: (ActOption | null)[] };
const storageKey = "act-prep:act-sentence-practice:v1";
const options: ActOption[] = ["A", "B", "C", "D"];
const subscribe = () => () => {};
const browserSnapshot = () => true;
const serverSnapshot = () => false;

function freshProgress(length: number): Progress {
  return { index: 0, answers: Array(length).fill(null) };
}

function loadProgress(length: number): Progress {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        const value = parsed as Partial<Progress>;
        if (Number.isInteger(value.index) && value.index! >= 0 && value.index! <= length &&
          Array.isArray(value.answers) && value.answers.length === length &&
          value.answers.every((answer) => answer === null || options.includes(answer))) {
          return { index: value.index!, answers: value.answers };
        }
      }
    }
  } catch {
    // The activity remains usable without browser storage.
  }
  return freshProgress(length);
}

export function ActSentencePractice({ questions, moduleHref }: { questions: ActSentenceQuestion[]; moduleHref: string }) {
  const hydrated = useSyncExternalStore(subscribe, browserSnapshot, serverSnapshot);
  const [progress, setProgress] = useState<Progress>(() => typeof window === "undefined" ? freshProgress(questions.length) : loadProgress(questions.length));
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
      <header className="act-practice-header"><p className="act-practice-kicker">ACT practice</p><h1 id="act-practice-title">Sentence anatomy</h1></header>
      <div className="act-practice-card act-practice-finish">
        <p className="act-practice-meta">Practice complete</p>
        <h2>{score} of {questions.length} correct</h2>
        <p>Review how each choice affects the sentence’s subject and main verb.</p>
        <ol className="act-practice-results">{questions.map((question, index) => <li key={question.id}><span>{question.source}</span><strong>{progress.answers[index] === question.correctOption ? "Correct" : `Answer: ${question.correctOption}`}</strong></li>)}</ol>
        <div className="act-practice-actions"><button type="button" onClick={() => { setProgress(freshProgress(questions.length)); setSelected(null); }}>Practice again</button><Link href={moduleHref}>Back to module</Link></div>
      </div>
    </section>;
  }

  const question = questions[progress.index];
  const checkedAnswer = progress.answers[progress.index];
  const checked = checkedAnswer !== null;
  const choice = checked ? checkedAnswer : selected;
  const correct = checkedAnswer === question.correctOption;

  function checkAnswer() {
    if (!selected || checked) return;
    setProgress((current) => ({ ...current, answers: current.answers.map((answer, index) => index === current.index ? selected : answer) }));
  }

  function continuePractice() {
    setProgress((current) => ({ ...current, index: current.index + 1 }));
    setSelected(null);
  }

  return <section className="act-practice" aria-labelledby="act-practice-title">
    <header className="act-practice-header">
      <p className="act-practice-kicker">ACT practice</p>
      <h1 id="act-practice-title">Sentence anatomy</h1>
      <p>Choose the wording that gives the sentence a subject and a main verb.</p>
    </header>
    <div className="act-practice-toolbar"><span>Question {progress.index + 1} of {questions.length}</span><span>{score} correct so far</span></div>
    <article className="act-practice-card" aria-labelledby="act-question-stem">
      <div className="act-practice-source"><span>{question.passageTitle}</span><span>{question.source}</span></div>
      <p className="act-practice-excerpt">{question.before} <mark>{question.target}</mark> {question.after}</p>
      <fieldset className="act-practice-choices" disabled={checked}>
        <legend id="act-question-stem">{question.stem}</legend>
        {question.choices.map(({ label, text }) => <label key={label} className={choice === label ? "is-selected" : ""}>
          <input type="radio" name="act-choice" value={label} checked={choice === label} onChange={() => setSelected(label)} />
          <span className="act-practice-choice-label">{label}.</span>
          <span>{text === "No Change" ? `No Change (${question.target})` : text}</span>
        </label>)}
      </fieldset>
      {checked && <div className="act-practice-feedback" role="status">
        <strong className={correct ? "is-correct" : "is-incorrect"}>{correct ? "Correct." : `The correct answer is ${question.correctOption}.`}</strong>
        <p>{question.explanation}</p>
      </div>}
      <div className="act-practice-actions">{checked
        ? <button type="button" onClick={continuePractice}>{progress.index === questions.length - 1 ? "See results" : "Next question"}</button>
        : <button type="button" disabled={!selected} onClick={checkAnswer}>Check answer</button>}
      </div>
    </article>
  </section>;
}
