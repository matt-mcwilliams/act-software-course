export const separatorOptions = [
  { id: "period", label: "Period (.)" },
  { id: "comma", label: "Comma alone (,)" },
  { id: "and", label: "And alone" },
  { id: "semicolon", label: "Semicolon (;)" },
  { id: "dash", label: "Em dash (—)" },
  { id: "comma-and", label: "Comma + and (, and)" },
  { id: "but", label: "But alone" },
  { id: "comma-but", label: "Comma + but (, but)" },
  { id: "so", label: "So alone" },
  { id: "colon", label: "Colon (:)" },
  { id: "comma-so", label: "Comma + so (, so)" },
  { id: "however", label: "Comma + however (, however)" },
];

export type RecallQuestion = { id: string; kind: "recall"; prompt: string; options: typeof separatorOptions; correct: string[] };
export type WrittenQuestion = { id: string; kind: "written"; prompt: string };
export type SentenceQuestion = {
  id: string;
  kind: "find" | "guided" | "binary";
  tokens: string[];
  separator: number;
  left: { subject: number | null; verb: number | null; independent: boolean };
  right: { subject: number | null; verb: number | null; independent: boolean };
  complete: boolean;
  explanation: string;
};
export type SeparatorQuestion = RecallQuestion | WrittenQuestion | SentenceQuestion;

// Split internal punctuation too, so students must distinguish the actual join
// from commas within introductory phrases and relative clauses.
function tokenize(text: string) { return text.match(/[\p{L}\p{N}’'-]+|[^\s\p{L}\p{N}]/gu) ?? []; }
type Clause = [text: string, subject: string | null, verb: string | null, independent?: boolean];
function sentence(id: string, kind: SentenceQuestion["kind"], left: Clause, join: string, right: Clause, complete: boolean, explanation: string): SentenceQuestion {
  const before = tokenize(left[0]);
  const after = tokenize(right[0]);
  const core = (clause: Clause, tokens: string[], offset: number) => ({
    subject: clause[1] === null ? null : tokens.indexOf(clause[1]) + offset,
    verb: clause[2] === null ? null : tokens.lastIndexOf(clause[2]) + offset,
    independent: clause[3] ?? true,
  });
  return { id, kind, tokens: [...before, join, ...after, "."], separator: before.length, left: core(left, before, 0), right: core(right, after, before.length + 1), complete, explanation };
}

export const separatorQuestions: SeparatorQuestion[] = [
  { id: "recall-one", kind: "recall", prompt: "Which three of these can separate independent clauses in this practice?", options: separatorOptions.filter((o) => ["comma", "period", "and", "semicolon", "dash", "comma-and"].includes(o.id)), correct: ["period", "semicolon", "comma-and"] },
  { id: "recall-two", kind: "recall", prompt: "Find the other three allowed separator types.", options: separatorOptions.filter((o) => ["but", "comma-but", "so", "colon", "comma-so", "however"].includes(o.id)), correct: ["comma-but", "colon", "comma-so"] },
  sentence("find-period", "find", ["Maya laughed", "Maya", "laughed"], ".", ["Leo smiled", "Leo", "smiled"], true, "A period separates two independent clauses: Maya laughed / Leo smiled."),
  sentence("find-semicolon", "find", ["The dog barked", "dog", "barked"], ";", ["the cat hid", "cat", "hid"], true, "A semicolon joins two independent clauses. Dog + barked and cat + hid form the two cores."),
  sentence("find-and", "find", ["After lunch, the students practiced quietly", "students", "practiced"], ", and", ["their teacher watched from the doorway", "teacher", "watched"], true, "The separator is comma + and, not the comma after lunch. Both sides have independent cores: students practiced / teacher watched."),
  sentence("find-but", "find", ["The runner who trained all summer felt tired", "runner", "felt"], ", but", ["she finished the race", "she", "finished"], true, "Comma + but joins runner + felt and she + finished. Trained belongs to the who clause, not the main core."),
  sentence("find-so", "find", ["Although the sky was clear, the wind was strong", "wind", "was"], ", so", ["the pilot delayed the flight", "pilot", "delayed"], true, "Comma + so joins the independent cores wind + was and pilot + delayed. Although the sky was clear is extra dependent detail."),
  sentence("find-colon", "find", ["The team needed three supplies", "team", "needed"], ":", ["rope, water, and a map", null, null, false], true, "Team + needed makes the left side independent. The list explains supplies. Removing the colon leaves an incorrect sentence; the right side does not need an independent core."),
  { id: "recall-written", kind: "written", prompt: "From memory, write all six allowed separator types." },
  sentence("guided-type-comma", "guided", ["The rain stopped", "rain", "stopped"], ",", ["the team returned outside", "team", "returned"], false, "Both sides are independent clauses, but a comma alone creates a comma splice. Use an allowed separator."),
  sentence("guided-type-valid", "guided", ["The lights dimmed", "lights", "dimmed"], ", and", ["the audience became quiet", "audience", "became"], true, "Comma + and correctly joins lights + dimmed and audience + became."),
  sentence("guided-type-and", "guided", ["The museum opened", "museum", "opened"], "and", ["the visitors entered", "visitors", "entered"], false, "In this practice, and alone is not an allowed separator between independent clauses. Add a comma before and."),
  sentence("guided-type-but", "guided", ["The artist who painted the mural waited", "artist", "waited"], "but", ["the guests arrived late", "guests", "arrived"], false, "Both cores are independent, but the separator needs a comma before but."),
  sentence("guided-type-colon", "guided", ["The instructions were simple", "instructions", "were"], ":", ["turn left at the bridge", null, "turn"], true, "Instructions + were is independent, and the directions explain simple. Without the colon this is incorrect. Only the left core needs marking."),
  sentence("guided-type-so", "guided", ["Because the road was icy, the driver slowed down", "driver", "slowed"], "so", ["the passengers arrived safely", "passengers", "arrived"], false, "Driver + slowed and passengers + arrived are independent. This practice requires comma + so, rather than so alone."),
  sentence("guided-core-ing", "guided", ["The students practicing after school", "students", null, false], ";", ["their coach watched", "coach", "watched"], false, "The left side is a fragment: practicing needs a helping verb. A valid separator cannot repair a missing main verb."),
  sentence("guided-core-valid", "guided", ["The students are practicing after school", "students", "are"], ";", ["their coach watches from the bench", "coach", "watches"], true, "Students + are (practicing) and coach + watches are independent cores, joined by a semicolon."),
  sentence("guided-core-relative", "guided", ["The gardener rested", "gardener", "rested"], ", but", ["the neighbor who worked nearby", "neighbor", null, false], false, "The right side has no main verb. Worked is inside the who clause; neighbor still needs a verb of its own."),
  sentence("guided-core-dependent", "guided", ["Because the wind was strong", "wind", "was", false], ".", ["The hikers stayed indoors", "hikers", "stayed"], false, "Because makes the left side dependent. Even with a subject and verb, it cannot stand on its own before a period."),
  sentence("guided-core-colon", "guided", ["The supplies included", "supplies", "included", false], ":", ["rope and water", null, null, false], false, "The left side is unfinished: included still needs its object. Removing the colon gives The supplies included rope and water, so this colon is incorrect."),
  sentence("guided-core-complex", "guided", ["The researcher who collected the samples returned", "researcher", "returned"], ", so", ["the assistants who had waited began their work", "assistants", "began"], true, "The independent cores are researcher + returned and assistants + began. The who clauses add detail; comma + so correctly joins the cores."),
  sentence("binary-type-dash", "binary", ["Maya waited", "Maya", "waited"], "—", ["Leo hurried home", "Leo", "hurried"], false, "An em dash is not one of the six separator types allowed in this practice. It can have other uses in English."),
  sentence("binary-type-period", "binary", ["The bird sang", "bird", "sang"], ".", ["The children listened", "children", "listened"], true, "A period correctly separates two independent clauses."),
  sentence("binary-type-however", "binary", ["The train was late", "train", "was"], ", however", ["the passengers waited calmly", "passengers", "waited"], false, "Comma + however cannot join independent clauses. Use a period or semicolon before however and a comma after it."),
  sentence("binary-type-but", "binary", ["The little dog barked loudly", "dog", "barked"], ", but", ["the sleeping cat ignored it", "cat", "ignored"], true, "Comma + but correctly joins two independent clauses."),
  sentence("binary-type-comma", "binary", ["Although the task was difficult, the team persisted", "team", "persisted"], ",", ["the project succeeded", "project", "succeeded"], false, "The comma between persisted and the project creates a comma splice; both sides are independent."),
  sentence("binary-type-colon", "binary", ["The recipe requires two ingredients", "recipe", "requires"], ":", ["flour and water", null, null, false], true, "The left side is complete. The list explains ingredients, and removing the colon would make the sentence incorrect."),
  sentence("binary-core-subject", "binary", ["The guide smiled", "guide", "smiled"], ";", ["was waiting by the door", null, "was", false], false, "The right side is missing a subject; a semicolon requires an independent clause on each side."),
  sentence("binary-core-ing", "binary", ["The puppy sleeping under the table", "puppy", null, false], ".", ["The family ate dinner", "family", "ate"], false, "The left side is a fragment: sleeping alone is not a main verb."),
  sentence("binary-core-valid", "binary", ["The puppy was sleeping under the table", "puppy", "was"], ", and", ["the family ate dinner", "family", "ate"], true, "Both independent clauses have subjects and main verbs; comma + and joins them correctly."),
  sentence("binary-core-relative", "binary", ["The scientist who discovered the fossil", "scientist", null, false], ";", ["the students took notes", "students", "took"], false, "Discovered belongs to the who clause. Scientist still has no main verb, so the left side is not independent."),
  sentence("binary-core-colon", "binary", ["The picnic basket contained", "basket", "contained", false], ":", ["bread, fruit, and cheese", null, null, false], false, "Contained needs its object; the left side is unfinished. The sentence works with the colon removed, so the colon is incorrect."),
  sentence("binary-core-complex", "binary", ["When the rain stopped, the musicians who had waited returned", "musicians", "returned"], ";", ["the audience applauded enthusiastically", "audience", "applauded"], true, "The main cores are musicians + returned and audience + applauded. The introductory and relative clauses add detail."),
];
