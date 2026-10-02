import testMap from "./master-test-map-english.json" with { type: "json" };

export type ActOption = "A" | "B" | "C" | "D";

export type ActSentenceQuestion = {
  id: string;
  source: string;
  passageTitle: string;
  stem: string;
  before: string;
  target: string;
  after: string;
  choices: { label: ActOption; text: string }[];
  correctOption: ActOption;
  explanation: string;
};

// Curated by reading each answer in its full sentence against the first lesson.
// The taxonomy's fragment tags do not determine this list.
const selections = [
  { testKey: "25MC1-English", number: 28, explanation: "Read each choice in the full sentence. A leaves the sentence core “visible storage provides”: “visible storage” is the subject, and “provides” is its main verb. In C, “which provides” only describes storage; in D, “providing” has no helping verb, and the added period separates it from “ways to display.” B does contain the verb “makes,” but “makes providing ways to display” does not complete its structure: it does not tell what is being made or give a complete construction such as “makes it possible to provide.” A supplies a complete subject-and-main-verb core and fits the rest of the sentence." },
  { testKey: "25MC2-English", number: 8, explanation: "With B inserted, the sentence core is “string music is transformed,” with “string music” as the subject. As in the video, “string music” is the subject and “is” is the main verb to identify; “transformed” is not the word to mark. In A, “that transforms” describes the music inside a relative clause. In C and D, “transforming” appears without a helping verb. Those choices leave the sentence without an independent clause’s main verb." },
  { testKey: "25MC2-English", number: 25, explanation: "With B inserted, “Shin” is the subject and “used” is the main verb: “In Queens, Shin used the fragments to construct an artwork.” A gives the noun phrase “Shin’s use of the fragments” without a main verb. C gives “using” without an independent subject-and-verb core. Deleting the highlighted words in D also leaves no sentence core. The verb “celebrated” belongs to “that celebrated a Korean tradition,” which describes the artwork; it cannot supply the independent clause’s verb." },
  { testKey: "25MC2-English", number: 47, explanation: "A leaves the sentence core “I began.” “To linger” follows that main verb; “where several native Hawaiians often played” describes the beach. B and C replace the core with an -ing phrase, and D leaves a prepositional phrase beginning “On the beach.” Although “played” is still present in the where clause, none of B, C, or D supplies the independent clause’s subject and main verb." },
  { testKey: "25MC5-English", number: 31, explanation: "With D inserted, set aside “During that time” and read the sentence core: “Frost’s team recovered.” “Frost’s team” is the subject, and “recovered” is its main verb. In A, “as Frost’s team recovered” is a dependent clause that needs a main clause. B gives a phrase beginning “with,” and C gives “recovering” without a helping verb. Those choices have no independent clause’s main verb. The later -ing phrase “painstakingly recording and publishing” adds detail; it does not replace “recovered.”" },
  { testKey: "25MC5-English", number: 37, explanation: "First identify the introductory clause: “When gravity causes the gas and dust to collapse.” It has its own subject and verb, but “When” makes it dependent. C adds the sentence core “stars form,” completing the sentence. A leaves “forming stars,” an -ing phrase; B leaves “to form stars,” an infinitive phrase. D keeps both “collapse” and “form” inside the dependent construction. A, B, and D do not add an independent clause’s subject and main verb." },
  { testKey: "26MC1-English", number: 4, explanation: "With D inserted, the sentence core is “rocky bottoms and plant life slow.” The compound subject includes both “bottoms” and “plant life”; “of daylighted streams” is extra detail between that subject and its main verb. A and C put “slow” in a relative clause beginning with “which” or “that,” leaving no independent-clause verb. B adds “these” after an already expressed subject, producing a redundant second subject instead of a grammatical core." },
] as const;

function clean(text: string) {
  return text.replace(/\[(?:[A-D]|\d+)\]\s*/g, "").replace(/\s+/g, " ").trim();
}

// Neighboring sentences can contain unrelated, deliberately incorrect test edits.
// Apply their grammar answer keys only to context; preserve the active item verbatim.
function correctedContext(passageKey: string, body: string, start: number, end: number): string {
  let context = body.slice(start, end);
  const edits = testMap.questions.filter((entry) => entry.passageKey === passageKey &&
    entry.stem === "Which choice makes the sentence most grammatically acceptable?" &&
    entry.characterStart !== null && entry.characterEnd !== null &&
    entry.characterStart >= start && entry.characterEnd <= end)
    .sort((left, right) => right.characterStart! - left.characterStart!);
  for (const edit of edits) {
    const replacement = edit[`option${edit.correctOption as ActOption}`];
    if (replacement === "No Change") continue;
    const text = replacement === "Delete the underlined portion." ? "" : replacement;
    const relativeStart = edit.characterStart! - start;
    const relativeEnd = edit.characterEnd! - start;
    context = context.slice(0, relativeStart) + text + context.slice(relativeEnd);
  }
  return clean(context);
}

export function getActSentenceQuestions(): ActSentenceQuestion[] {
  const passages = testMap.tests.flatMap((test) => test.passages);
  const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });

  return selections.map(({ testKey, number, explanation }) => {
    const question = testMap.questions.find((entry) => entry.testKey === testKey && entry.questionNumber === number);
    if (!question) throw new Error(`Missing ACT question ${testKey} #${number}`);
    if (question.characterStart === null || question.characterEnd === null) throw new Error(`Missing ACT question span: ${testKey} #${number}`);
    const passage = passages.find((entry) => entry.passageKey === question.passageKey);
    if (!passage) throw new Error(`Missing ACT passage for ${testKey} #${number}`);

    const sentences = [...segmenter.segment(passage.body)].filter(({ segment }) => !/^\s*\[(?:[A-D]|\d+)\]\s*$/.test(segment));
    const current = sentences.findIndex(({ index, segment }) => index <= question.characterStart && index + segment.length >= question.characterEnd);
    if (current < 0) throw new Error(`ACT question span crosses sentences: ${testKey} #${number}`);
    const first = Math.max(0, current - 2);
    const last = Math.min(sentences.length - 1, current + 2);
    const excerptStart = sentences[first].index;
    const excerptEnd = sentences[last].index + sentences[last].segment.length;
    const target = passage.body.slice(question.characterStart, question.characterEnd);
    if (!target.trim()) throw new Error(`Empty ACT question span: ${testKey} #${number}`);

    return {
      id: `${testKey}-${number}`,
      source: `ACT Form ${testKey.replace("-English", "")}, question ${number}`,
      passageTitle: passage.title,
      stem: question.stem,
      before: correctedContext(passage.passageKey, passage.body, excerptStart, question.characterStart),
      target,
      after: correctedContext(passage.passageKey, passage.body, question.characterEnd, excerptEnd),
      choices: (["A", "B", "C", "D"] as const).map((label) => ({ label, text: question[`option${label}`] })),
      correctOption: question.correctOption as ActOption,
      explanation,
    };
  });
}
