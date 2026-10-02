import assert from "node:assert/strict";
import test from "node:test";
import { sentenceAnatomyPractice, words } from "../src/data/custom-practice.ts";
import { advanceProgress, answerIsCorrect, currentProblem, initialProgress, submitAnswer } from "../src/lib/sentence-practice.ts";

test("the bank has four ordered stages and valid marked words", () => {
  assert.equal(sentenceAnatomyPractice.stages.length, 4);
  assert.deepEqual(sentenceAnatomyPractice.stages.map((stage) => stage.checkCompleteness), [false, true, false, true]);
  for (const stage of sentenceAnatomyPractice.stages) {
    assert.equal(stage.slots.length, 6);
    for (const variants of stage.slots) {
      assert.ok(variants.length >= 3);
      for (const problem of variants) {
        const tokens = words(problem);
        assert.ok(problem.subject.length > 0);
        assert.ok(problem.subject.every((index) => index >= 0 && index < tokens.length));
        assert.equal(problem.subject.length, 1);
        assert.doesNotMatch(tokens[problem.subject[0]], /^(?:a|an|the)$/i);
        assert.ok(problem.verb === undefined ? problem.fragmentReason : problem.verb >= 0 && problem.verb < tokens.length);
        assert.doesNotMatch(problem.text, /\b(?:and|but|or|nor|for|yet|so)\b/i);
      }
    }
  }
});

test("the subject excludes its article while the finite helper is the verb", () => {
  const problem = sentenceAnatomyPractice.stages[0].slots[4][0];
  let progress = { ...initialProgress(), subject: [1], verb: 2 };
  assert.equal(answerIsCorrect(progress, problem), true);
  progress = { ...progress, verb: 3 };
  assert.equal(answerIsCorrect(progress, problem), false);
  progress = { ...progress, subject: [0, 1], verb: 2 };
  assert.equal(answerIsCorrect(progress, problem), false);
  progress = { ...progress, subject: [0] };
  assert.equal(answerIsCorrect(progress, problem), false);
});

test("two retries precede answer reveal and remove first-try credit", () => {
  const problem = currentProblem(initialProgress());
  assert.ok(problem);
  let progress = { ...initialProgress(), subject: [0], verb: 0 };
  progress = submitAnswer(progress, problem);
  assert.equal(progress.attempts, 1);
  assert.equal(progress.solved, false);
  progress = submitAnswer(progress, problem);
  assert.equal(progress.attempts, 2);
  assert.equal(progress.solved, false);
  progress = submitAnswer(progress, problem);
  assert.equal(progress.attempts, 3);
  assert.equal(progress.solved, true);
  assert.equal(progress.firstTryCredit, false);
  assert.deepEqual(advanceProgress(progress).results, [false]);
});

test("a later correct attempt solves a problem without earning first-try credit", () => {
  const problem = currentProblem(initialProgress());
  assert.ok(problem);
  let progress = { ...initialProgress(), subject: [0], verb: 0 };
  progress = submitAnswer(progress, problem);
  progress = submitAnswer({ ...progress, verb: 1 }, problem);
  assert.equal(progress.attempts, 2);
  assert.equal(progress.solved, true);
  assert.equal(progress.firstTryCredit, false);
});

test("completeness and missing-main-verb choices are graded as one answer", () => {
  const fragment = sentenceAnatomyPractice.stages[1].slots[1][0];
  const complete = sentenceAnatomyPractice.stages[1].slots[5][0];
  const base = { ...initialProgress(), stageIndex: 1 };
  assert.equal(answerIsCorrect({ ...base, choice: "fragment", missing: "main verb" }, fragment), true);
  assert.equal(answerIsCorrect({ ...base, choice: "fragment", missing: "subject" }, fragment), false);
  assert.equal(answerIsCorrect({ ...base, choice: "complete", subject: complete.subject, verb: complete.verb ?? null }, complete), true);
  assert.equal(answerIsCorrect({ ...base, choice: "fragment", missing: "main verb" }, complete), false);
});

test("five first-try successes pass a full group", () => {
  let progress = initialProgress();
  for (let index = 0; index < 6; index += 1) {
    progress = advanceProgress({ ...progress, solved: true, firstTryCredit: index !== 2 });
  }
  assert.equal(progress.stageIndex, 1);
  assert.equal(progress.groupsPerStage[0], 1);
});

test("a slot retires after three consecutive first-try groups and counts toward five", () => {
  let progress = initialProgress();
  for (let group = 0; group < 3; group += 1) {
    for (const slot of progress.activeSlots) {
      progress = advanceProgress({ ...progress, solved: true, firstTryCredit: slot === 0 });
    }
  }
  assert.equal(progress.group, 4);
  assert.equal(progress.retired[0][0], true);
  assert.deepEqual(progress.activeSlots, [1, 2, 3, 4, 5]);
  for (const slot of progress.activeSlots) {
    progress = advanceProgress({ ...progress, solved: true, firstTryCredit: slot !== 5 });
  }
  assert.equal(progress.stageIndex, 1);
  assert.equal(progress.groupsPerStage[0], 4);
});

test("a missed first try breaks a slot's consecutive-group streak", () => {
  let progress = initialProgress();
  for (let group = 0; group < 3; group += 1) {
    for (const slot of progress.activeSlots) {
      progress = advanceProgress({ ...progress, solved: true, firstTryCredit: slot === 0 && group !== 1 });
    }
  }
  assert.equal(progress.retired[0][0], false);
  assert.equal(progress.streaks[0][0], 1);
});
