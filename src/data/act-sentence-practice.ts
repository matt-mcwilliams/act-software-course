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
  { testKey: "25MC1-English", number: 28, explanation: "“Visible storage” is the subject and “provides” is its main verb. “Which provides” places that verb inside a relative clause, while “providing” cannot be the main verb by itself." },
  { testKey: "25MC2-English", number: 8, explanation: "“The string music” is the subject. Choice B supplies the finite main verb “is.” In A, “transforms” belongs to a relative clause; in C and D, “transforming” has no helping verb." },
  { testKey: "25MC2-English", number: 25, explanation: "“Shin” is the subject and “used” is the main verb. “Shin’s use of” names a thing, and “using” alone cannot serve as the sentence’s main verb." },
  { testKey: "25MC2-English", number: 47, explanation: "“I” is the subject and “began” is the main verb. The other choices turn the sentence opening into an -ing phrase or leave it without a main clause." },
  { testKey: "25MC5-English", number: 31, explanation: "“Frost’s team” is the subject and “recovered” is the main verb. With “as,” “with,” or “recovering” in the other choices, the sentence lacks a finite verb in its main clause." },
  { testKey: "25MC5-English", number: 37, explanation: "“When gravity causes the gas and dust to collapse” is a dependent clause. Choice C adds the independent clause “stars form”: “stars” is its subject and “form” its main verb." },
  { testKey: "26MC1-English", number: 4, explanation: "“The rocky bottoms and plant life” is the compound subject, and “slow” is its main verb. “Which” or “that” would put “slow” in a relative clause instead." },
] as const;

function clean(text: string) {
  return text.replace(/\[(?:[A-D]|\d+)\]\s*/g, "").replace(/\s+/g, " ").trim();
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
      before: clean(passage.body.slice(excerptStart, question.characterStart)),
      target,
      after: clean(passage.body.slice(question.characterEnd, excerptEnd)),
      choices: (["A", "B", "C", "D"] as const).map((label) => ({ label, text: question[`option${label}`] })),
      correctOption: question.correctOption as ActOption,
      explanation,
    };
  });
}
