import assert from "node:assert/strict";
import test from "node:test";
import source from "../src/data/master-test-map-english.json" with { type: "json" };
import { getActSentenceQuestions } from "../src/data/act-sentence-practice.ts";

test("the curated ACT set is distinct and grounded in source questions", () => {
  const questions = getActSentenceQuestions();
  assert.deepEqual(questions.map((question) => question.id), [
    "25MC1-English-28", "25MC2-English-8", "25MC2-English-25",
    "25MC2-English-47", "25MC5-English-31", "25MC5-English-37",
    "26MC1-English-4",
  ]);

  for (const question of questions) {
    const original = source.questions.find((entry) => `${entry.testKey}-${entry.questionNumber}` === question.id);
    assert.ok(original);
    const passage = source.tests.flatMap((entry) => entry.passages).find((entry) => entry.passageKey === original.passageKey);
    assert.ok(passage);
    assert.equal(question.target, passage.body.slice(original.characterStart, original.characterEnd));
    assert.equal(question.correctOption, original.correctOption);
    assert.deepEqual(question.choices.map((choice) => choice.text), [original.optionA, original.optionB, original.optionC, original.optionD]);
    assert.ok(question.before.length > 0 && question.after.length > 0);
    assert.match(question.explanation, /subject/);
    assert.match(question.explanation, /verb/);
  }
});


test("unrelated grammar edits in the surrounding passage use their answer keys", () => {
  const questions = getActSentenceQuestions();
  const shin = questions.find((question) => question.id === "25MC2-English-25");
  assert.match(shin.before, /many of which are adorned/);
  assert.doesNotMatch(shin.before, /many of whose/);
  const wreck = questions.find((question) => question.id === "25MC5-English-31");
  assert.match(wreck.after, /remnants of the ship were restored/);
  const nebula = questions.find((question) => question.id === "25MC5-English-37");
  assert.match(nebula.after, /The nebula, home to thousands of young stars, is often called/);
  assert.equal(nebula.target, "collapse, forming stars.");
  assert.equal(shin.correctOption, "B");
});

test("ACT explanations explicitly address the deceptive alternatives", () => {
  for (const question of getActSentenceQuestions()) {
    assert.match(question.explanation, /main verb|independent/);
  }
  const storage = getActSentenceQuestions()[0];
  assert.match(storage.explanation, /does contain the verb “makes/);
});
