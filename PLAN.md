# Phase 1 plan: course catalogue to module view

## Goal and boundaries

Build the first navigable slice of a future course catalogue: **course selection → ACT English module selection → one module view**. Course selection is non-sequential: learners may enter any published course directly. Modules within a course have a defined order; for now, only the first ACT English module exists. The module view shows its eleven atoms in the exact order below. An atom is one video, reading, or practice activity and will eventually have its own page.

This phase delivers the three selection/view pages and their responsive design. It does not build video players, practice interactions, atom pages, mastery scoring, accounts, or persisted progress. The interface must not imply that any of those features already work. As atom pages are delivered later, their rows become links to those pages.

## Learner journey and navigation

| Page | URL | Main question answered | Primary action |
| --- | --- | --- | --- |
| Course selection | `/` | “Which course do I want?” | Select **ACT English** |
| Module selection | `/courses/act-english` | “Where do I start in ACT English?” | Open **Module 1** |
| Module view | `/courses/act-english/modules/module-1` | “What is in this module, and in what order?” | Review the eleven-atom sequence |

- Use literal, descriptive link labels such as “ACT English” and “View Module 1”; avoid generic “Continue” labels when there is no progress state.
- On the module selection page, provide a clear “All courses” link. On the module view, provide “ACT English modules” and “All courses” links in a small breadcrumb or equivalent back navigation. Keep the current page as plain text, not a link.
- Every available destination must work by direct URL as well as by clicking through the catalogue. Invalid course or module IDs should show a useful not-found page with a route back to courses.
- Do not render dead buttons, links to unbuilt atom pages, or a “Start module” action until the first atom page exists. The module view can present the atoms as an ordered, informational list in this phase.
- Preserve the hierarchy in headings and URLs so a learner can tell at a glance whether they are choosing a course, choosing a module, or viewing a module.

## Page design

### 1. Course selection

- Header: understated site name and a single page title, “Courses.” Add one short line explaining that learners can choose a course in any order.
- Present ACT English as the one available course in a spacious, clearly clickable row or card. Show its name, a concise description, and an explicit “View modules” affordance. Make the full row/card a single link so keyboard and pointer users have one target.
- The layout must grow into a catalogue without redesign: a simple responsive list or grid can support later courses. Do not fabricate other course cards, completion percentages, or “coming soon” courses without actual course records.

### 2. ACT English module selection

- Title the page “ACT English”; place “Modules” nearby as the section label. Add one sentence that modules are followed in order.
- Show a numbered module list with **Module 1** as the sole available entry. Its supporting text should describe only verified content. A working title such as “Anatomy of a Sentence” may be used only after the course author confirms that this is the first module; `STYLE.md` references a lesson deck by that name but does not establish the course outline.
- Give the available module one clear link to its module view. Later modules should appear only after their metadata is written. When more modules exist, maintain an explicit `order` field and display them in that order; never infer sequence from a title or filesystem position.
- “Sequential” defines the intended learning order. This phase has no completion data, so do not claim modules are unlocked or completed. When progress is introduced, specify the prerequisite and bypass rules before adding lock states.

### 3. Module view

- Header: breadcrumb back to ACT English, “Module 1” title, and a short factual summary such as “11 activities: videos, custom practice, ACT practice problems, and a mastery check.”
- Make the learning sequence the main content. Use one ordered list with visible positions **01–11**; each item shows its activity type and its position. Keep labels distinct even when adjacent atoms share a type. Until lesson names are authored, use restrained working labels such as “Video 1,” “Custom practice 1,” and “ACT practice problems 1.” Do not invent durations, question counts, video topics, scores, or completion states.
- A quiet line of guidance can say that activities are meant to be taken in order. The final mastery check is visually recognizable by its title and position, without a decorative color or a false pass state.
- On wider screens, keep the list in a readable central column. On narrow screens, stack labels and descriptions without truncation or horizontal scrolling. Avoid a busy timeline, sidebar, or dashboard treatment for eleven items.

## Exact atom sequence and content model

Store the course, module, and atom summaries in a small typed content module rather than duplicating them across pages. Use stable IDs and a separate numeric `order`, so labels can change without breaking future URLs. Suggested shape:

```ts
type AtomType = "video" | "custom-practice" | "act-practice" | "mastery-check";
type AtomSummary = {
  id: string; // stable within the module, e.g. "atom-01"
  order: number;
  type: AtomType;
  title: string;
  availability: "planned" | "published";
};
type ModuleSummary = {
  id: string; // e.g. "module-1"
  order: number;
  title: string;
  atoms: AtomSummary[];
};
type CourseSummary = {
  id: string; // e.g. "act-english"
  title: string;
  modules: ModuleSummary[];
};
```

| Position | Type | Working display label |
| ---: | --- | --- |
| 01 | Video | Video 1 |
| 02 | Custom practice | Custom practice 1 |
| 03 | ACT practice problems | ACT practice problems 1 |
| 04 | Video | Video 2 |
| 05 | Custom practice | Custom practice 2 |
| 06 | ACT practice problems | ACT practice problems 2 |
| 07 | Video | Video 3 |
| 08 | Custom practice | Custom practice 3 |
| 09 | Custom practice | Custom practice 4 |
| 10 | ACT practice problems | ACT practice problems 3 |
| 11 | Module mastery check | Module mastery check |

Keep this order explicit in the data and render from that data. Do not treat the ACT English taxonomy/test JSON as a course outline: `src/data/master-test-map-english.json` contains skills and test questions, while the module and atom sequence is a separate authored layer. Later ACT problem atoms may reference chosen questions by stable IDs after their content is curated.

## Visual system and interaction details

- Follow `STYLE.md`: warm `#F7F7F5` canvas, dark blue-gray `#1F2A37` text, restrained white surfaces, generous whitespace, serif-led headings/reading copy, and sans-serif navigation/metadata. Reuse its spacing, radius, and focus tokens.
- Reserve blue, red, and green for their documented semantic roles in English instruction and result states. Use neutral ink and surface contrast for catalogue/module navigation; do not color code video versus practice with those grammar colors.
- Keep page titles large and regular weight, supporting copy short, and atom rows easy to scan. Prefer whitespace and a subtle separator over borders around every item or heavy shadows.
- Give each interactive card/link a visible hover and keyboard focus state; the link text must still explain its destination without color or an arrow icon. Do not put nested links or buttons inside a linked card.
- Use semantic `<main>`, `<nav aria-label="Breadcrumb">`, headings in order, and `<ol>` for ordered modules and atoms. Mark the current breadcrumb item with `aria-current="page"`. Give links comfortable touch targets and keep contrast readable on both canvas and white surfaces.
- Prefer the Libertinus families if local font files become available; use the fallback stack from `STYLE.md` until then. Do not add a network font dependency solely for the catalogue.

## Implementation plan

1. **Content source:** Add a typed, local course manifest containing ACT English, Module 1, and the exact eleven atom summaries. Expose small lookup helpers for course and module IDs. Keep catalogue data separate from rendering components and from the existing test taxonomy JSON.
2. **Routes:** Replace the starter `src/app/page.tsx` with course selection. Add `src/app/courses/[courseId]/page.tsx` and `src/app/courses/[courseId]/modules/[moduleId]/page.tsx`. Follow the installed Next.js App Router documentation in `node_modules/next/dist/docs/` before coding, including its async `params` convention for dynamic pages. Resolve IDs from the manifest and call `notFound()` for missing entries.
3. **Shared UI:** Implement a small page shell, breadcrumb, and catalogue/list item pattern only where repetition warrants it. Use Server Components for these static pages; client code is unnecessary for plain navigation. Use `next/link` for internal links.
4. **Styling:** Establish the `STYLE.md` tokens in `src/app/globals.css`, then build responsive layouts for the three views. Use the project’s existing Tailwind setup only where it improves clarity; keep the visual tokens authoritative and avoid mixing competing systems.
5. **Page metadata and empty/error states:** Set clear titles/descriptions for each page using the installed version’s Metadata API. Provide a simple not-found experience with a path to the course catalogue. Render unavailable atoms as text, not disabled interactive controls.
6. **Future atom routing contract:** Reserve `/courses/[courseId]/modules/[moduleId]/atoms/[atomId]` for individual atom pages. Add actual routes and links only as each atom is implemented. The manifest’s stable IDs and `availability` field determine which rows can link; never send a learner to a placeholder route.

## Phase 1 completion criteria

- The three pages form a clear path from `/` to the ACT English module view, with working back navigation and direct URLs.
- Course choice is independent of order; the ACT English module list presents its modules in authored sequence.
- The module view shows **exactly eleven** atoms with the types and order in the table above, including two consecutive custom practice atoms at positions 08 and 09.
- No action promises an atom page, saved progress, unlock state, or mastery result that is not implemented.
- Layout and typography remain readable on phone and desktop widths; keyboard navigation, visible focus, heading structure, and link labels make the path understandable without visual cues alone.
- Unknown course/module URLs show a useful not-found state. Content edits to titles or future catalogue entries happen in the manifest, without rewriting the page components.

## Later phases

Author and publish each atom as its own page, implement the custom practice formats and ACT problem delivery, then add mastery evaluation and progress persistence. Define the actual first-module title and atom lesson titles with course content before replacing the working labels above. Add module unlocking only after the completion rules and persistence model are specified.
