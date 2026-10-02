export type SentenceProblem = {
  text: string;
  subject: number[];
  verb?: number;
  fragmentReason?: "ing" | "relative";
};

export type SentenceStage = {
  title: string;
  instruction: string;
  checkCompleteness: boolean;
  slots: SentenceProblem[][];
};

export type CustomPractice = {
  id: string;
  format: "sentence-anatomy";
  stages: SentenceStage[];
};

const complete = (text: string, subject: number[], verb: number): SentenceProblem => ({ text, subject, verb });
const fragment = (text: string, subject: number[], fragmentReason: "ing" | "relative"): SentenceProblem => ({ text, subject, fragmentReason });

export const sentenceAnatomyPractice: CustomPractice = {
  id: "eng-ss-anatomy-custom-practice",
  format: "sentence-anatomy",
  stages: [
    {
      title: "Find the sentence core",
      instruction: "Mark the subject and the main verb in each short sentence.",
      checkCompleteness: false,
      slots: [
        [complete("Jessie yells.", [0], 1), complete("Maya laughs.", [0], 1), complete("Ravi smiles.", [0], 1)],
        [complete("The dog barked.", [1], 2), complete("A bird sang.", [1], 2), complete("The bell rang.", [1], 2)],
        [complete("I listened.", [0], 1), complete("She waited.", [0], 1), complete("They cheered.", [0], 1)],
        [complete("The children danced.", [1], 2), complete("A teacher waved.", [1], 2), complete("The runners rested.", [1], 2)],
        [complete("The dog is barking.", [1], 2), complete("I am running.", [0], 1), complete("The baby is sleeping.", [1], 2)],
        [complete("The gate was closed.", [1], 2), complete("She has arrived.", [0], 1), complete("The lights were shining.", [1], 2)],
      ],
    },
    {
      title: "Complete or fragment?",
      instruction: "Decide whether each short example is complete. Then mark its core or identify what is missing.",
      checkCompleteness: true,
      slots: [
        [complete("Kathleen jumps.", [0], 1), complete("The cat sleeps.", [1], 2), complete("Leo sings.", [0], 1)],
        [fragment("The athlete running.", [1], "ing"), fragment("Michael waving.", [0], "ing"), fragment("The puppy jumping.", [1], "ing")],
        [complete("The doors open.", [1], 2), complete("Nora smiles.", [0], 1), complete("The leaves fall.", [1], 2)],
        [fragment("The boy who plays.", [1], "relative"), fragment("The door that opens.", [1], "relative"), fragment("Hannah who eats.", [0], "relative")],
        [complete("The dog is barking.", [1], 2), complete("Michael is waving.", [0], 1), complete("The athlete is running.", [1], 2)],
        [complete("The boy who plays baseball scored.", [1], 5), complete("The door that opens squeaks.", [1], 4), complete("Hannah who eats slowly smiles.", [0], 4)],
      ],
    },
    {
      title: "Find the core in longer sentences",
      instruction: "Ignore extra detail and mark the subject and main verb of the independent clause.",
      checkCompleteness: false,
      slots: [
        [complete("The cheerful student hurried home.", [2], 3), complete("A tired runner crossed the field.", [2], 3), complete("The little bird flew away.", [2], 3)],
        [complete("After lunch, the students practiced quietly.", [3], 4), complete("Before sunrise, the farmer worked outside.", [3], 4), complete("During class, the teacher spoke softly.", [3], 4)],
        [complete("The artist with the blue notebook sketches daily.", [1], 6), complete("A child near the window laughed loudly.", [1], 5), complete("The runner in the red shirt rested briefly.", [1], 6)],
        [complete("The students who study after school improve steadily.", [1], 6), complete("The neighbor who walks every morning waves cheerfully.", [1], 6), complete("A bird that nests above our porch sings daily.", [1], 7)],
        [complete("The excited campers are hiking through the forest.", [2], 3), complete("My younger brother is reading beside the fire.", [2], 3), complete("The sleepy dog was resting under the table.", [2], 3)],
        [complete("Although the wind was strong, the pilot landed safely.", [6], 7), complete("When the lights dimmed, the audience became silent.", [5], 6), complete("Because the path was icy, the hikers moved carefully.", [6], 7)],
      ],
    },
    {
      title: "Check longer sentences",
      instruction: "Decide whether the independent clause has a main verb, then complete the follow-up.",
      checkCompleteness: true,
      slots: [
        [complete("After dinner, the children played outside.", [3], 4), complete("The careful driver stopped near the bridge.", [2], 3), complete("Before dawn, the birds sang loudly.", [3], 4)],
        [fragment("The students practicing after school.", [1], "ing"), fragment("A traveler walking beside the river.", [1], "ing"), fragment("The gardener working behind the house.", [1], "ing")],
        [fragment("The student who practiced after school.", [1], "relative"), fragment("A traveler who walked beside the river.", [1], "relative"), fragment("The gardener who worked behind the house.", [1], "relative")],
        [complete("The students are practicing after school.", [1], 2), complete("A traveler was walking beside the river.", [1], 2), complete("The gardener is working behind the house.", [1], 2)],
        [complete("The student who practiced after school improved.", [1], 6), complete("A traveler who walked beside the river waved.", [1], 7), complete("The gardener who worked behind the house rested.", [1], 7)],
        [fragment("The artist who was painting near the window.", [1], "relative"), complete("Although the rain was falling, the team practiced indoors.", [6], 7), complete("The athlete running beside the track is smiling.", [1], 6)],
      ],
    },
  ],
};

export function words(problem: SentenceProblem) {
  return problem.text.split(/\s+/);
}
