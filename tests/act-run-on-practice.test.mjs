import assert from "node:assert/strict";
import test from "node:test";
import source from "../src/data/master-test-map-english.json" with { type: "json" };
import { getActRunOnQuestions } from "../src/data/act-run-on-practice.ts";

test("run-on practice uses lesson-aligned source items with exact spans and answer keys", () => {
  const questions = getActRunOnQuestions();
  assert.deepEqual(questions.map(({ id }) => id), [
    "25MC2-English-24", "25MC3-English-6", "25MC3-English-14", "25MC3-English-22",
    "25MC4-English-16", "25MC5-English-8", "25MC5-English-15",
    "26MC1-English-19", "26MC1-English-21", "26MC1-English-49",
  ]);
  for (const question of questions) {
    const original = source.questions.find((entry) => `${entry.testKey}-${entry.questionNumber}` === question.id);
    const passage = source.tests.flatMap(({ passages }) => passages).find(({ passageKey }) => passageKey === original.passageKey);
    assert.ok(Object.values(original.wrongAnswerClassifications).some(({ skillIds }) => skillIds.includes("ENG-CS-SS-002")));
    assert.equal(question.target, passage.body.slice(original.characterStart, original.characterEnd));
    assert.equal(question.correctOption, original.correctOption);
    assert.deepEqual(question.choices.map(({ text }) => text), [original.optionA, original.optionB, original.optionC, original.optionD]);
    assert.ok(question.before && question.after);
    assert.match(question.explanation, /subject/);
    assert.match(question.explanation, /main verb/);
  }
});

test("run-on context preserves sentence joins and corrects neighboring test edits", () => {
  const questions = getActRunOnQuestions();
  const stone = questions.find(({ id }) => id === "25MC3-English-14");
  assert.match(stone.before, /added its powder/);
  assert.match(stone.after, /^worked\./);
  const artists = questions.find(({ id }) => id === "25MC5-English-15");
  assert.match(artists.after, /^as Keret explains it, use the space/);
  assert.match(artists.explanation, /shares two main verbs/);
});
