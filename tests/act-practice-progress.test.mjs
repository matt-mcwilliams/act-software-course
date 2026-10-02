import assert from "node:assert/strict";
import test from "node:test";
import { freshActProgress, restoreActProgress, submitActAnswer } from "../src/lib/act-sentence-practice.ts";

test("the first miss leaves the answer hidden and saves the retry across reloads", () => {
  const missed = submitActAnswer(freshActProgress(2), "A", "B");
  assert.deepEqual(missed.answers, [null, null]);
  assert.deepEqual(missed.firstMisses, ["A", null]);
  const restored = restoreActProgress(JSON.parse(JSON.stringify(missed)), 2);
  assert.deepEqual(restored, missed);
  assert.equal(submitActAnswer(restored, "C", "B").answers[0], "C");
});

test("a correct first answer or retry completes the question and earns credit", () => {
  assert.equal(submitActAnswer(freshActProgress(1), "B", "B").answers[0], "B");
  const missed = submitActAnswer(freshActProgress(1), "A", "B");
  assert.equal(submitActAnswer(missed, "B", "B").answers[0], "B");
});

test("a second miss completes the question, including repeating the same choice", () => {
  const missed = submitActAnswer(freshActProgress(2), "A", "B");
  const completed = submitActAnswer(missed, "A", "B");
  assert.equal(completed.answers[0], "A");
  assert.deepEqual(submitActAnswer(completed, "B", "B"), completed);
  const next = submitActAnswer({ ...completed, index: 1 }, "C", "D");
  assert.deepEqual(next.answers, ["A", null]);
  assert.deepEqual(next.firstMisses, ["A", "C"]);
  assert.deepEqual(freshActProgress(2).firstMisses, [null, null]);
});

test("existing saved answers are preserved and malformed retry state resets safely", () => {
  assert.deepEqual(restoreActProgress({ index: 1, answers: ["B", null] }, 2), {
    index: 1, answers: ["B", null], firstMisses: [null, null],
  });
  for (const firstMisses of [["E", null], ["A"], null]) {
    assert.deepEqual(restoreActProgress({ index: 0, answers: [null, null], firstMisses }, 2), freshActProgress(2));
  }
});
