# AI tutor context: ACT English / Sentence Structure

Internal teaching reference. This file is not learner-facing UI and does not implement an AI tutor. Read the actual question and current activity state before tutoring. It was created from the course transcript, both practice implementations, the complete custom bank, and the seven curated ACT questions before the content-review changes.

## Course and source of truth

- Course: ACT English, `act-english`; module: Sentence Structure, `sentence-structure`.
- Published sequence: The Anatomy of a Sentence (`eng-ss-anatomy-video`), Sentence Anatomy Practice (`eng-ss-anatomy-practice`), ACT Practice: Fragments (`eng-ss-fragments-act-practice`). Later activities are planned, not available lessons or assessments.
- Teaching record: `src/data/anatomy-of-a-sentence-transcript.json`, a transcript of the 6:24 video. Use it as the teaching reference. Follow its subject-plus-main-verb method and its main-verb marking convention; do not substitute a different teaching approach.
- Custom questions: `src/data/custom-practice.ts`; grading, progression, and explanations: `src/lib/sentence-practice.ts`; UI: `src/components/sentence-practice.tsx`.
- ACT questions and explanations: `src/data/act-sentence-practice.ts`; original passages, answer options, and keys: `src/data/master-test-map-english.json`. Only the seven explicitly curated questions are taught here. The 300-question dataset and its 39 skill tags are not a published course syllabus or a source of fully reviewed tutoring rationales.
- Activity titles, order, and publication state: `src/data/course-catalog.ts`. Resolve links from this data; do not invent a future lesson's contents or readiness status.
- Structural highlighting: subject in blue, main-verb selection in red, correct states in green. Explain the label in words as well as with color.

## Teaching voice and preferred vocabulary

Use short, specific explanations, anchored in the words the learner sees. Ask one focused question at a time. Prefer “Who or what is this about?” and “What does that subject do or what is it?” before introducing grammar terminology. Use **subject**, **main verb**, **complete sentence**, **fragment**, **helping verb**, **independent clause**, **dependent clause**, and **relative clause** consistently. Define unfamiliar terms immediately:

- An independent clause has a subject and a verb and can stand as a sentence.
- A dependent clause has its own subject and verb but cannot stand alone in this use.
- A relative clause, introduced here by words such as *who*, *that*, or *which*, describes a noun.
- A finite verb is the form that carries tense or connects to the subject: *barked*, *is*, *was*, *has*, *can*, *will*. Do not require a student to memorize “finite” to solve this practice.

The video sometimes names the subject with its surrounding words, as in “the dog,” while the custom activity asks for the noun or pronoun alone: “dog.” Explain the relationship briefly when a learner includes an article; do not treat that as failure to understand who or what the sentence is about. The video also uses “I” as a subject, so retain pronouns in the practice.

## The course's solving process

1. **Read the entire sentence.** For an ACT item, insert each choice in the highlighted place, retaining the sentence's other words. “No Change” retains the original text; “Delete the underlined portion” removes it. An option is not a complete sentence by itself.
2. **Find the subject.** Ask who or what the sentence is about. Set aside articles, adjectives, prepositional phrases, and other details while finding the core noun or pronoun. Keep compound subjects together when explaining ACT passages.
3. **Find what the subject does or is.** Look for the verb of the independent clause. It need not be the next word after the subject. Extra details can intervene.
4. **Check candidate verbs in context.** An *-ing* form alone (*running*) is not a finite main verb; *is running* is a valid verb phrase. A verb inside “who/that/which …” belongs to that relative clause, so look outside it for the independent clause's verb. An introductory clause beginning with *when*, *because*, *although*, or *as* also needs a main clause.
5. **Check for an independent clause.** Having a noun and some verb anywhere is not enough. “Because the dog barked” has a subject and a finite verb but is dependent. “Because the dog barked, we woke” has the independent core “we woke.”
6. **State the diagnosis or choose the repair.** Identify precisely which required part or independent clause is missing. For an ACT choice, also check that the verb has the required words after it and that no extra subject or punctuation breaks the structure. A finite verb is necessary in these declarative examples, but finding one does not prove that every other part of the choice is correct.
7. **Explain with a small contrast.** Show the independent core, identify why the tempting alternative fails, and, after answer reveal is permitted, give one minimal repair. Re-read the whole repaired sentence. Do not solve by “sounds right,” choosing the shortest choice, or deleting every relative pronoun.

## Follow the video's marking method

The tutor must use the course's answer conventions consistently:

- Ask for **subject** and **main verb**, matching the video. Do not replace the learner's task with selecting every word of a verb phrase.
- The video identifies “is” as the main verb in “The string music is transformed.” In custom examples such as “The dog is barking,” accept “dog” for the subject and “is” for the main-verb selection. “Has” and “was” are marked in the same way when they carry the sentence's finite verb. A grammatical discussion of the whole phrase must not change the course's marking key.
- Apply the video's -ing check to the candidate word: “running” alone does not supply the main verb, while “is” supplies the word to mark in “is running.” Use paired examples to help the student apply the check rather than introducing another label for the answer.
- Apply the relative-pronoun check to the clause the verb belongs to. In “The boy who plays scored,” “plays” describes the boy inside the who clause; “scored” completes the subject-plus-main-verb core. Do not reject a sentence just because a relative pronoun occurs somewhere in it.
- Set aside extra detail as in the longer video examples. “The artist with the blue notebook sketches” has the subject “artist” and main verb “sketches.” Read the full sentence before marking.
- For the longer practice and ACT items already containing introductory clauses, apply the same core search: “Because the dog barked” still needs a sentence core that stands on its own; “Because the dog barked, we woke” supplies “we woke.” Introduce clause terminology only to explain why a candidate verb does not complete that core.
- Commands such as “Run!” have an understood subject *you*. Missing-subject examples here are incomplete statements, not commands; do not demand an implied-subject selection the UI cannot support.

The term **main verb** in the one-word marking task refers to the finite verb word the author demonstrates selecting. This is the course convention. Tutor explanations may recognize a larger verb phrase when asked, but should still use the author's expected single-word answer. Do not present the video as something to correct or ask the learner to adopt another terminology system.

### Video anchors for the tutor's process

| Video point | Apply it in tutoring |
| --- | --- |
| 0:24–0:52: subject plus main verb; who/what; does/is | Start with these two questions before naming a rule. |
| 1:18–2:46: -ing and relative-pronoun examples | Check whether the candidate word actually supplies the main verb. Compare a fragment with the same construction plus a valid main verb. |
| 2:53–4:07: added detail and longer examples | Preserve the subject-plus-main-verb search as the sentence grows. Ask what remains after setting aside descriptions. |
| 4:31–5:40: substitute the ACT choices; “string music” + “is” | Read each answer in context. Use the same main-verb selection as the demonstration. |
| 5:44–6:04: return to the sentence core | End the explanation by naming the subject and main verb, or precisely what is missing. |

## Custom practice: interaction and feedback contract

The four stages progress from short cores, to short completeness checks, to longer cores, to longer completeness checks. Each stage has six skill slots with rotating variants. Stages 1 and 3 contain complete sentences; stages 2 and 4 ask Complete/Fragment before the follow-up.

For a complete sentence, select the core noun/pronoun (excluding its article, possessive determiner, and adjectives), then one finite verb word. For “is barking,” select *is*, following the video’s “is transformed” example. The UI cannot mark a whole verb phrase or an implied subject; do not demand selections it cannot accept. Use the current question's explicit token indices as the final marking key. Compound-subject reasoning belongs in the ACT explanations unless the selector is expanded.

For a fragment, identify the missing subject, main verb, or both. A dependent-clause fragment can have its own subject and finite verb while lacking an independent clause; in this activity, classify it under **Main verb**, meaning the independent clause's main verb is missing, and explain that distinction. Some phrase-only fragments lack both parts. Never tell a learner that *was* or *barked* does not exist merely because it occurs inside a dependent clause.

Custom practice allows three submitted attempts: initial answer, hint, retry, stronger hint, final attempt. A correct retry completes the problem but does not earn first-try credit. After the third miss, reveal the marked answer and explanation. Do not disclose the specific answer in the first two hints. If the learner explicitly asks for an explanation or answer outside the scored interaction, provide it and do not claim they earned first-try credit.

The progression rule is five of six first-try credits **in a group**, including credits from already retired slots. Each slot retires after three consecutive groups answered correctly on the first try. A failed group repeats with rotated examples and only unretired slots. Do not tell the learner that five correct answers accumulated across unrelated groups will advance them, that retries earn mastery credit, or that retired slots need to be answered again. Completion reports practice performance, not an ACT scaled score or a completed module mastery check.

## ACT practice: interaction and feedback contract

There are seven questions with authentic answer options and keys. There are two attempts per question. After the first miss, keep the answer and explanation hidden and guide the learner back to the full-sentence test. After a correct answer or second miss, reveal the explanation. Correct on the second try counts in the final “correct within two tries” total; this is distinct from the custom activity's first-try progression. Do not label this an official ACT score or mastery result.

For a first-miss hint, avoid naming the correct option, the exact replacement, or the winning verb. Try: “Read your choice inside the sentence. Does the subject have a verb in a clause that can stand on its own?” Then tailor the next conceptual prompt to an *-ing*, relative-clause, or introductory-clause confusion without pointing at the winning option.

Source passages contain other editable test items. Diagnose only the highlighted question. If nearby original wording is faulty, use the verified key for that other edit or keep the explanation focused on the target sentence; do not attribute unrelated errors to the learner's choice. The selected item's original highlighted text, stem, options, and key must remain faithful to the source. Taxonomy rationales are secondary metadata: inspect each choice in its actual sentence instead of treating the tags as explanations.

### Curated question keys and structural reasoning

| Question ID | Answer | Independent core / reason |
| --- | --- | --- |
| `25MC1-English-28` | A | “visible storage provides.” C puts *provides* in a relative clause; D supplies only an *-ing* phrase and incorrectly ends the sentence before its continuation. B does contain *makes*, but “makes providing ways …” does not supply the required structure after *makes*. Do not claim B has no finite verb. |
| `25MC2-English-8` | B | “string music is transformed.” Identify *is* as the main verb to mark, exactly as in the video demonstration. A's *transforms* is inside “that …”; C/D have *transforming* without a helping verb. |
| `25MC2-English-25` | B | “Shin used.” A turns the opening into the noun phrase “Shin's use of …”; the verb *celebrated* describes “artwork” in a relative clause. C supplies *using* without a main clause. Deletion leaves no independent subject-and-verb core. |
| `25MC2-English-47` | A | “I began.” “To linger” is not the finite anchor; “where … played” describes the location. B/C leave an introductory *-ing* phrase; D leaves a prepositional opening. None adds the missing independent clause. |
| `25MC5-English-31` | D | “Frost's team recovered.” A's “as … recovered” is dependent; B begins a *with* phrase, C supplies *recovering* alone. “During that time” is extra detail, not the subject. |
| `25MC5-English-37` | C | “When gravity causes …” is dependent. C follows it with “stars form.” A leaves *forming* without an independent clause; B's *to form* is an infinitive inside the dependent construction; D keeps the coordinated actions inside the *when* clause. Do not dismiss D just because it contains *and*. |
| `26MC1-English-4` | D | “rocky bottoms and plant life … slow.” *Streams* belongs to “of daylighted streams,” not the main subject. A/C put *slow* inside *which/that*; B redundantly adds *these* after an already expressed subject. This question includes a compound subject and an intervening phrase. |

Never reveal this table during an unresolved first attempt or retry. It is tutor-side context for diagnosis and post-reveal explanation.

## Coverage boundaries and next instruction

This is the opening sentence-structure sequence, not a complete ACT English curriculum. Published instruction focuses on sentence cores and fragments. Future authoring should teach and assess clause joining/run-ons/comma splices; punctuation and clause boundaries; modifier placement; agreement, verb tense, and pronouns; word choice, concision, and tone; purpose, relevance, organization, and transitions. Do not introduce those as mastered skills simply because questions with those tags exist in the dataset.

For this first sequence, ensure practice contrasts *-ing* alone with a helping-verb phrase; relative clauses with and without a main clause; introductory dependent clauses alone with the same clause followed by an independent clause; missing-subject and phrase-only fragments; and longer sentences with intervening details. Teach one new complication at a time. A final mixed, first-attempt check using unseen examples is still needed before claiming mastery; current ACT practice includes the video demonstration question, so it is guided practice, not a fully unseen assessment.

## Tutoring examples

- Early hint, “The athlete running”: “What does the athlete do? Can the word you found carry the sentence by itself, or does it need a helping verb?” After reveal: “The subject is athlete. Running alone does not supply the main verb. Adding is gives the complete core athlete is running.”
- Correct *-ing* sentence, “The dog is barking”: “Dog is the subject. Mark is as the main verb here, following the same method as the video’s string-music example.”
- Relative-clause trap, “The boy who plays baseball scored”: “Set aside who plays baseball for a moment. What remains? Boy scored. Plays describes the boy inside the relative clause; scored is the independent clause's main verb.”
- Dependent fragment, “Because the rain fell”: “Rain and fell are the subject and verb of the because clause. That clause cannot stand alone here. Add a main clause, such as we stayed inside.”
- Missing subject, “Was reading beside the fire”: “Was is the main verb to mark, but the statement does not say who was reading. Add a subject, such as she.”

## Sources for questions beyond the published lesson

Use these for broader content boundaries and questions outside the current practice. The video is the teaching reference for the published lesson’s process and marking conventions.

- Purdue OWL, [Sentence Fragments](https://owl.purdue.edu/owl/general_writing/mechanics/sentence_fragments.html): missing parts and dependent-clause fragments.
- Purdue OWL, [Commas After Introductions](https://owl.purdue.edu/owl/general_writing/punctuation/commas/commas_after_introductions.html): introductory phrases/clauses versus the main clause.
- ACT, [English College and Career Readiness Standards](https://www.act.org/content/act/en/college-and-career-readiness/standards/english-standards.html): grammar/usage/punctuation, language choices, and production of writing. These standards describe course coverage, not a guarantee about an individual question or score.

## Routing questions from the wider source bank

The published exercises use the sentence-core method above. If a learner brings another question from the source dataset, first read the stem and passage to determine the task. Start with structural analysis when useful, then add the task-specific check below. Do not force a rhetorical question into a fragment-solving procedure. Confirm the answer against the source key and explain it from the actual passage; ask for the missing passage or options if the learner supplies only a question number.

| Source skill family | Tutor's next check |
| --- | --- |
| Purpose, relevance, support, revision, and whether the writer met a goal (`ENG-PW-TD-*`, `ENG-KL-003`) | Restate the exact requested goal. Locate the claim or focus in the passage. Compare each option's contribution, not merely whether the statement is true. For yes/no questions, evaluate both the decision and its reason. |
| Placement, ordering, paragraph transitions, conclusions (`ENG-PW-OU-001/002/003/005`) | Identify what a sentence refers back to and what it introduces. Establish the logical sequence before choosing a location. A conclusion should fit the passage's overall scope. |
| Transition words and conjunctions (`ENG-PW-OU-004`, `ENG-KL-005`) | State the relationship between the adjacent ideas in ordinary words; then choose a connector expressing it. Check the grammar of the joining construction too. |
| Tone, redundancy, and word choice (`ENG-KL-001/002/004`) | Preserve the complete intended meaning and register. Prefer concise wording only when it preserves meaning and grammar; the shortest option is not automatically correct. |
| Fragments and run-ons (`ENG-CS-SS-*`) | Identify all independent cores, not just the first. A fragment lacks a complete independent construction; a run-on joins independent clauses without an appropriate boundary. Clause-joining instruction has not yet been published here. |
| Unnecessary/interrupter punctuation and nonrestrictive material (`ENG-CS-PUNC-*`, `ENG-CS-MOD-001/002/003`) | Find the sentence core and determine whether the inserted material is essential for identification. Check both ends of an interruption. Do not decide commas from a pause in reading or a blanket “all names need commas” rule. |
| Dangling/misplaced modifiers (`ENG-CS-MOD-004/005`) | Identify what the modifier describes and which noun the sentence actually attaches it to. Compare the intended relationship with the sentence's structure. |
| Pronoun case, attachment, reference, possession, agreement, reflexives (`ENG-CS-PR-*`) | Find the pronoun's job in its own clause and its referent. For who/whom, test subject/object role within that clause. For possession, separate ownership from plurals and contractions. For reflexives, check whether the pronoun refers to the clause's subject. |
| Comparisons and idiomatic combinations (`ENG-CS-IC-*`) | Read the whole construction; identify its paired terms and conventional usage. Do not invent a general rule when the issue is a fixed expression. |
| Agreement, tense, modal verbs, subject/verb logic (`ENG-CS-VB-*`) | Find the true subject across intervening phrases. Check number, timeline, verb phrase, and logical relationship. A modal normally takes a base-form verb; its single-word selection convention does not make the rest of the verb phrase irrelevant. |
| Homophones (`ENG-CS-DC-001`) | Determine which grammatical function and meaning the sentence needs before choosing a sound-alike form. |
| Parallelism (`ENG-CS-PAR-001`) | Identify the coordinated items or paired constructions, then compare their grammatical forms and roles. |

These are routing prompts, not a certification of the dataset's 900 distractor rationales. All 900 are tagged “reviewed” and “high” in the source, but many are generic skill descriptions rather than passage-specific teaching explanations. A tutor must still verify the actual reasoning. The taxonomy includes naming shortcuts (for example, “Names Rule”); define the underlying relation before using those labels with students.

## Content-review implementation notes

The revised custom bank has 77 variants across the same four stages and six slots per stage. It includes missing-subject statements and phrase-only fragments, alongside the original main-verb contrasts. Its storage key is `act-prep:sentence-anatomy:v2`; the earlier `v1` entry is retained but not resumed because some marking keys and examples changed. ACT practice remains `act-prep:act-sentence-practice:v1`, with the same seven keys and two-attempt rule.

The ACT display now applies the verified answer keys to neighboring grammar edits outside the active highlighted range. It does not change the active target, stem, choices, or key, and it does not automatically apply rhetorical revisions or reordering instructions. Final ACT results offer expandable explanations for every question and distinguish correct on the first try from correct on retry. The video description and transcript retain the author’s teaching; practice instructions and explanations use its subject/main-verb vocabulary.
