import assert from "node:assert/strict";
import test from "node:test";
import { separatorQuestions } from "../src/data/separator-practice.ts";
import { canCheckSeparator, emptyAnswer, freshSeparatorProgress, gradeSeparator, restoreSeparatorProgress } from "../src/lib/separator-practice.ts";

const get = (id) => separatorQuestions.find((q) => q.id === id);
function proof(q) {
  return { ...emptyAnswer(), complete: true, separator: q.separator, leftSubject: q.left.subject, leftVerb: q.left.verb, rightSubject: q.right.subject, rightVerb: q.right.verb, removed: false };
}

test("recall covers precisely six allowed types, with three answers per phase and delayed written recall", () => {
  const recalls = separatorQuestions.filter((q) => q.kind === "recall");
  assert.deepEqual(recalls.flatMap((q) => q.correct).sort(), ["period", "semicolon", "comma-and", "comma-but", "comma-so", "colon"].sort());
  for (const q of recalls) {
    assert.equal(canCheckSeparator(q, { ...emptyAnswer(), options: q.correct.slice(0, 2) }), false);
    assert.equal(gradeSeparator(q, { ...emptyAnswer(), options: q.correct }), true);
    assert.equal(gradeSeparator(q, { ...emptyAnswer(), options: q.options.filter((o) => !q.correct.includes(o.id)).map((o) => o.id) }), false);
  }
  const writtenIndex = separatorQuestions.findIndex((q) => q.kind === "written");
  assert.equal(separatorQuestions[writtenIndex - 1].kind, "find");
  assert.equal(gradeSeparator(separatorQuestions[writtenIndex], { ...emptyAnswer(), written: "any response" }), null);
});

test("all sentence keys point to real core words and accepted sentences can be answered correctly", () => {
  assert.equal(new Set(separatorQuestions.map((q) => q.id)).size, separatorQuestions.length);
  for (const q of separatorQuestions.filter((q) => "tokens" in q)) {
    for (const side of [q.left, q.right]) {
      for (const index of [side.subject, side.verb]) if (index !== null) assert.match(q.tokens[index], /\p{L}/u, q.id);
      if (side.independent && side.subject === null) assert.equal(q.tokens[q.separator], ":", q.id);
    }
    if (q.complete) assert.equal(gradeSeparator(q, proof(q)), true, q.id);
    if (q.kind !== "find") {
      assert.equal(gradeSeparator(q, { ...emptyAnswer(), complete: q.complete }), q.kind === "binary" || !q.complete, q.id);
      assert.equal(gradeSeparator(q, { ...emptyAnswer(), complete: !q.complete }), false, q.id);
    }
  }
});

test("guided yes needs separator and both cores before grading; wrong punctuation or core fails", () => {
  const complex = get("find-so");
  assert.equal(complex.left.verb, complex.tokens.lastIndexOf("was"));
  const q = get("guided-type-valid");
  const answer = proof(q);
  for (const field of ["separator", "leftSubject", "leftVerb", "rightSubject", "rightVerb"]) {
    assert.equal(canCheckSeparator(q, { ...answer, [field]: null }), false);
  }
  assert.equal(gradeSeparator(q, { ...answer, rightVerb: answer.rightSubject }), false);
  assert.equal(gradeSeparator(q, { ...answer, separator: 0 }), false);
  const no = { ...emptyAnswer(), complete: false };
  assert.equal(canCheckSeparator(get("guided-type-comma"), no), true);
  assert.equal(gradeSeparator(get("guided-type-comma"), no), true);
  assert.equal(gradeSeparator(get("guided-type-valid"), no), false);
});

test("colon proof requires only left core plus a no on removal, and yes is incorrect", () => {
  const q = get("find-colon");
  const answer = { ...proof(q), rightSubject: null, rightVerb: null };
  assert.equal(canCheckSeparator(q, answer), true);
  assert.equal(gradeSeparator(q, answer), true);
  assert.equal(canCheckSeparator(q, { ...answer, removed: null }), false);
  assert.equal(gradeSeparator(q, { ...answer, removed: true }), false);
  assert.equal(gradeSeparator(get("guided-core-colon"), { ...proof(get("guided-core-colon")), complete: true }), false);
});

test("binary questions need only yes or no, with both valid and invalid examples", () => {
  for (const q of separatorQuestions.filter((q) => q.kind === "binary")) {
    assert.equal(canCheckSeparator(q, emptyAnswer()), false);
    assert.equal(canCheckSeparator(q, { ...emptyAnswer(), complete: true }), true);
    assert.equal(gradeSeparator(q, { ...emptyAnswer(), complete: q.complete }), true);
    assert.equal(gradeSeparator(q, { ...emptyAnswer(), complete: !q.complete }), false);
  }
});

test("progress restores drafts, checked answers, written responses and finished practice; malformed saves reset", () => {
  const fresh = freshSeparatorProgress(separatorQuestions.length);
  const saved = { ...fresh, started: true, draft: { ...emptyAnswer(), options: ["period"] } };
  assert.deepEqual(restoreSeparatorProgress(JSON.parse(JSON.stringify(saved)), separatorQuestions), saved);
  const answers = separatorQuestions.map((q) => q.kind === "recall" ? { ...emptyAnswer(), options: q.correct } : q.kind === "written" ? { ...emptyAnswer(), written: "Period, semicolon, comma + and, comma + but, comma + so, colon" } : q.kind === "binary" || !q.complete ? { ...emptyAnswer(), complete: q.complete } : proof(q));
  const finished = { ...fresh, started: true, index: separatorQuestions.length, answers };
  assert.deepEqual(restoreSeparatorProgress(JSON.parse(JSON.stringify(finished)), separatorQuestions), finished);
  for (const invalid of [null, {}, { ...saved, index: -1 }, { ...saved, index: 2 }, { ...saved, draft: { ...saved.draft, separator: 10000 } }, { ...saved, draft: { ...saved.draft, options: ["period", "period"] } }]) {
    assert.deepEqual(restoreSeparatorProgress(invalid, separatorQuestions), fresh);
  }
});
