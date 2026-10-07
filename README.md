# ACT Software Course

A Next.js course site with a published opening sequence for ACT English. Sentence Structure currently contains The Anatomy of a Sentence, Sentence Anatomy Practice, ACT Practice: Fragments, and Joining Sentences. Seven additional activities are planned and unavailable.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000. Other checks:

```bash
npm test
npm run lint
npm run build
```

Use Node.js with native TypeScript stripping and JSON import attributes for the test suite. Before changing Next.js behavior, consult the documentation shipped in `node_modules/next/dist/docs/` and the repository's `AGENTS.md`. Use `STYLE.md` for frontend defaults.

## Published routes

- Courses: `/`
- ACT English: `/courses/act-english`
- Sentence Structure: `/courses/act-english/modules/sentence-structure`
- Video: `/courses/act-english/modules/sentence-structure/activities/eng-ss-anatomy-video`
- Next video: `/courses/act-english/modules/sentence-structure/activities/eng-ss-joining-video`
- Custom practice: `/courses/act-english/modules/sentence-structure/activities/eng-ss-anatomy-practice`
- ACT practice: `/courses/act-english/modules/sentence-structure/activities/eng-ss-fragments-act-practice`

The videos use Mux. Practice progress is saved locally in the learner's browser; there are no accounts, cross-device progress, ACT scaled scores, or published module mastery assessment.

## Content and teaching references

- [Course catalogue](src/data/course-catalog.ts): titles, order, publication state, descriptions, and video configuration.
- [Video transcript](src/data/anatomy-of-a-sentence-transcript.json): the teaching reference for the subject-plus-main-verb method used by the practice and tutor guide.
- [Custom question bank](src/data/custom-practice.ts) and [grading/progression](src/lib/sentence-practice.ts): four stages, six slots each, three attempts, and five-of-six first-try credits per passing group.
- [Curated ACT practice](src/data/act-sentence-practice.ts): seven source questions, full-sentence explanations, and answer-key corrections to unrelated neighboring grammar edits. Active stems, options, targets, and keys stay original.
- [ACT taxonomy and test data](src/data/master-test-map-english.json): six forms, 300 questions, and 39 skill records; this source bank is separate from the published syllabus.
- [Internal AI tutor context](internal/AI_TUTOR_CONTEXT.md): the author's solving process, grammatical conventions, question-specific reasoning, and hint/reveal boundaries. This reference does not implement an AI tutor.
- [Content review](internal/CONTENT_REVIEW.md): consistency findings, completed corrections, alignment with the video, and remaining coverage priorities.

`PLAN.md` is the historical first-phase plan. Current behavior and routes are described above.
