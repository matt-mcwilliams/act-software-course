# Content alignment review: ACT software course

Review date: 2026-10-01. The video is the teaching reference for this review. The question is whether the surrounding content, practice, and tutoring follow the method the author already teaches. This review does not evaluate how the video was made or recommend changing the author's presentation.

Scope: catalogue and activity copy; the complete supplied transcript as the reference; all original 72 custom examples and their marking keys; all seven published ACT questions and their alternatives in context; feedback and progression language; naming; all 39 taxonomy entries; structural integrity of the 300-question source bank. The unpublished lessons and all 900 source distractor rationales have not been individually validated as teaching material.

`AI_TUTOR_CONTEXT.md` was created before editing existing content and then aligned with the author's clarification. It captures the video’s method, marking conventions, question-specific reasoning, hint/reveal rules, and the context needed to tutor both practices.

## The method everything should follow

1. Read the sentence. For an ACT question, substitute each choice into the highlighted portion.
2. Find who or what the sentence is about: the subject.
3. Find what that subject does or is: the main verb.
4. Check whether a candidate is an -ing word or a verb inside a relative clause rather than the main verb that completes the sentence core.
5. Set aside extra detail while retaining the subject-plus-main-verb core.
6. If the example is a fragment, identify what is missing. If complete, name or mark the subject and main verb.

Use the same marking as the video's string-music example: “is” is the word to identify as the main verb in “is transformed.” Custom examples such as “is barking” should ask for “is,” with no competing instruction to select the full phrase. Explain article exclusion as the practice's marking convention: “the dog” names the subject in an explanation, but the word button to select is “dog.”

## Findings and changes

| Area | Alignment or coverage issue | Change |
| --- | --- | --- |
| Subject marking | The practice expects one noun/pronoun, but the learner was only told to mark the subject. An article could be selected even with the right understanding. | Explain the one-word selection before the first attempt. Feedback names the same subject/main-verb pair used in the video. |
| Main-verb marking | Explanations and hints needed to reinforce the exact answer convention used in the string-music demonstration. | Use “main verb” consistently and mark “is,” “has,” or “was” in the corresponding examples. The tutor guide instructs the tutor to respect these keys. |
| Missing-part coverage | The video establishes subject and main verb as required parts, but every original practice fragment had the same missing-part answer: Main verb. Subject and Both were offered without any keyed examples. | Add missing-subject statements and phrase-only fragments; grade and reveal all three choices correctly. Revised bank: 77 variants across the same four stages/six slots per stage. |
| Longer fragments | Existing practice and ACT items include introductory clauses as well as relative clauses. Students need to keep applying the same search for a sentence core. | Add dependent-clause contrasts and explain them by finding the main clause's missing core. Introduce terminology only where it helps with the actual question. |
| ACT solving process | The instruction did not explicitly tell students to substitute each choice, despite that being the video's demonstrated method. | Put whole-sentence substitution and subject/main-verb identification in the practice instruction and first-miss prompt. |
| ACT explanations | Some distractors were omitted from the original explanations, so the method did not explain every available choice. | Explain the correct core and the structural reason each alternative fails. Retain original stems, targets, options, and keys. |
| ACT surrounding context | Nearby source edits still contained unrelated errors such as “many of whose,” “remnants … was,” and “The nebula, is home …”. These could distract from the highlighted core. | Apply the source keys to neighboring grammar edits outside the target. Keep the active item original and leave rhetorical revisions untouched. |
| Feedback and progression | “Five first-try credits” did not explain the per-group threshold; custom and ACT retries had different scoring meanings. | Explain three custom attempts, five-of-six credits in a group, and mastered-level credits. Label the ACT total as correct within two tries and distinguish first-try/retry results. |
| Reviewing results | ACT completion offered answer letters but no way to revisit the explanatory process. | Add expandable explanations for all seven questions on the results screen. |
| Course/module copy | Placeholder Latin text, “etc.,” a joined “mastery checkLearn” description, and 0% labels did not describe the actual available content. | Replace placeholder copy with the current scope; show three available/eight planned activities and Practice/Planned labels. |
| Naming and documentation | Planned activity capitalization and README routes/status were inconsistent with the implemented sequence. | Keep published names/IDs, standardize planned title capitalization, document current routes/content sources, and label the first phase plan historical. |

## Current coverage

The video-to-practice sequence now applies the same method to short and long sentence cores, -ing traps, relative-clause traps, extra descriptions, helping-verb examples using the author's marking convention, missing subjects, missing main verbs, and examples missing both parts. The seven ACT items add full-sentence substitution, a compound subject, deletion, introductory clauses, and a redundant second subject.

The custom UI still selects one subject word and one main-verb word. Compound subjects are explained in ACT context, where students select an option rather than multiple word buttons. Do not instruct students to mark a whole compound subject using the current custom UI.

## Remaining coverage priorities

- The current three activities form an introductory sentence-core/fragment sequence. Eight listed activities remain planned, including the module mastery check.
- The video names joining complete sentences as the next topic. Continue the same method by finding each subject-plus-main-verb core before teaching how to join the cores. Add practice and explanations when that lesson is authored.
- A mixed, unseen mastery check is still needed. Custom first-try practice and retry-enabled ACT questions have different purposes; the ACT set includes the string-music problem already demonstrated in the video.
- A complete ACT English course will also need authored instruction and practice for punctuation, modifiers, agreement/verb forms, pronouns, parallelism/comparisons, word choice/concision/tone, purpose/relevance/support, organization, and transitions. Those skills exist in the source taxonomy but are not yet taught in published activities. See [ACT's English standards](https://www.act.org/content/act/en/college-and-career-readiness/standards/english-standards.html) for broader curriculum coverage.
- All 300 source questions passed reference/range/answer-label checks. Many of the 900 distractor rationales use generic diagnosis text despite “reviewed/high” tags. Verify the reasoning in context before exposing these as tutor explanations; the seven published items now have specific explanations.

## Validation and practical details

Regression tests cover every revised custom variant, all missing-part choices, the video's main-verb selection convention, original progression/retry behavior, and fidelity to the seven ACT questions. Browser verification covers new fragment categories, helping-verb selections, first-miss hints, ACT explanation review, and desktop/mobile layouts.

Custom practice now uses `act-prep:sentence-anatomy:v2` because some examples and their keys changed. Old `v1` progress remains stored but is not resumed against the revised questions. ACT questions, keys, retry rules, and stored progress are retained. The author's existing shortened video summary and unchanged transcript remain the reference.
