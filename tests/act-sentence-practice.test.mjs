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
