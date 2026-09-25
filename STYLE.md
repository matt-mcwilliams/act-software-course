# Website Style Guide

## Source and intent

This guide translates the visual system of `Video 1.1: Anatomy of a Sentence` into a website design system. The source is a 38-page, 16:9 instructional deck with generous whitespace, serif-led typography, and a small semantic color vocabulary.

The website should feel like an editorial lesson or annotated worksheet: calm, spacious, highly legible, and precise. Use color to explain structure, not as decoration.

## Design principles

- Lead with clear sentence-level hierarchy and generous breathing room.
- Keep the page background warm and nearly white.
- Use a dark blue-gray for neutral copy instead of pure black.
- Use blue, red, and green as semantic annotation colors.
- Favor centered compositions for teaching moments and left-aligned compositions for longer reading.
- Prefer whitespace and grouping over visible borders and heavy shadows.
- Keep examples concrete, with the important word or phrase highlighted inline.

## Visual foundation

### Canvas

The slide canvas is a warm off-white. It is the default website background and should occupy most of the page.

```css
:root {
  --color-canvas: #F7F7F5;
  --color-surface: #FFFFFF;
  --color-ink: #1F2A37;
  --color-muted: #6B7280;
}
```

The deck uses white as a distinct surface for the ACT-style question cards. Keep those cards visibly lighter than the surrounding canvas without introducing a pronounced shadow.

### Exact source colors

The following values are taken from the embedded RGB color operators in the PDF, then expressed as hex values for CSS.

| Token | Hex | Role in the deck |
| --- | --- | --- |
| `--color-canvas` | `#F7F7F5` | Slide/page background |
| `--color-ink` | `#1F2A37` | Primary sentence text, headings, bullets, symbols |
| `--color-muted` | `#6B7280` | Explanatory copy, labels, subtitles, annotations |
| `--color-subject` | `#2563EB` | Subject labels and subject phrases |
| `--color-verb` | `#DC2626` | Main verb labels and main verb phrases |
| `--color-positive` | `#16A34A` | Correct states and additional grammatical elements |
| `--color-surface` | `#FFFFFF` | Rounded question-card surface |

Black also appears in source-question content and compatibility glyphs. It is not the primary website text color; use `--color-ink` for the general interface.

### Derived web utility tokens

These are web implementation tokens derived from the source system rather than directly visible as dominant deck colors.

```css
:root {
  --color-border-subtle: rgba(31, 42, 55, 0.14);
  --color-focus-ring: #2563EB;
  --color-disabled: rgba(107, 114, 128, 0.55);
  --shadow-card: none;
  --radius-card: 0.75rem;
  --radius-control: 0.5rem;
}
```

Use `--color-border-subtle` sparingly for form controls or separators that need more definition than the deck itself provides. The default card treatment is surface contrast, not an outline.

## Typography

### Font roles

The dominant deck fonts are embedded Libertinus families:

- `Libertinus Serif Display` is the primary display and reading face. Use it for page titles, lesson headings, examples, sentence text, and editorial copy.
- `Libertinus Sans` is the supporting UI face. Use it for compact labels, metadata, navigation, controls, and utility text.
- `Libertinus Sans Italic` is appropriate for grammatical terms or inline emphasis when a slanted treatment is needed.
- `Libertinus Sans Bold` is used for strong state labels such as `Complete` and `Fragment`.
- `Times New Roman` appears in the ACT-style source-question cards. Treat it as a source-content face, not the main product face.

Use self-hosted Libertinus fonts when available. The following fallbacks preserve the deck's serif/sans contrast:

```css
:root {
  --font-display: "Libertinus Serif Display", "Libertinus Serif", Georgia, "Times New Roman", serif;
  --font-ui: "Libertinus Sans", Arial, Helvetica, sans-serif;
  --font-source: "Times New Roman", Times, Georgia, serif;
}

body {
  color: var(--color-ink);
  background: var(--color-canvas);
  font-family: var(--font-display);
}

button,
input,
select,
textarea,
nav,
small,
[data-ui] {
  font-family: var(--font-ui);
}
```

### Web type scale

The values below are web adaptations of the deck's large presentation type. They preserve its hierarchy without copying slide sizes literally.

| Role | Size | Line height | Weight | Font |
| --- | ---: | ---: | ---: | --- |
| Display title | `clamp(2.25rem, 5vw, 4.5rem)` | `1.04` | 400 | Serif display |
| Section title | `clamp(1.75rem, 3vw, 2.75rem)` | `1.1` | 400 | Serif display |
| Lesson lead | `clamp(1.35rem, 2.2vw, 2rem)` | `1.25` | 400 | Serif display |
| Body copy | `1.125rem` | `1.45` | 400 | Serif display |
| Sentence example | `clamp(1.25rem, 2.4vw, 2rem)` | `1.3` | 400 | Serif display |
| Annotation label | `0.95rem` | `1.3` | 400 | UI sans or serif display |
| Utility/citation | `0.75rem` | `1.3` | 700 | UI sans |

Keep body copy comfortably readable on the web. Do not shrink instructional examples to fit a dense grid.

### Type behavior

- Keep headings in regular weight unless the content is a state label or a deliberate callout.
- Use bold for `Complete`, `Fragment`, summaries, and other explicit status labels.
- Use italics for grammatical terms such as `running`, `that`, `who`, or `which` when the content calls for word-level emphasis.
- Keep letter spacing close to normal. The deck's polish comes from spacing and contrast, not tracking-heavy typography.
- Use sentence case for website navigation and explanatory headings. Reserve all caps for short semantic labels such as `SUBJECT` and `MAIN VERB`.
- Keep line lengths near 60 to 72 characters for reading content and 40 to 56 characters for instructional examples.

## Layout and spacing

### Composition

The source deck is 720 x 405 points, a 16:9 canvas. Recreate its calm, centered composition in wide website sections while allowing the page to become left-aligned for long-form reading.

```css
.lesson-shell {
  width: min(100% - 3rem, 72rem);
  margin-inline: auto;
}

.lesson-stage {
  min-height: min(42rem, 78svh);
  display: grid;
  place-items: center;
  padding: clamp(3rem, 9vw, 7rem) clamp(1.5rem, 6vw, 5rem);
}
```

Use generous outer margins. On a slide-like section, content should generally occupy about 78% to 88% of the available width, leaving a visibly quiet perimeter.

### Spacing tokens

Use a restrained scale based on 4px increments.

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
}
```

Recommended use:

- `--space-2` to `--space-3` between a label and its value.
- `--space-4` to `--space-6` between related lines or list items.
- `--space-8` to `--space-12` between an example and its annotation.
- `--space-16` to `--space-24` between major instructional sections.

## Semantic color usage

The deck's colors are grammatical markers. Preserve those meanings across the website.

### Blue: subject

Use `#2563EB` for the subject label and the subject phrase in a sentence. It is the first structural anchor in the deck.

### Red: main verb

Use `#DC2626` for the main verb label and main verb phrase. Use it for verb-focused warnings only when the warning is directly about the main verb.

### Green: positive or additional structure

Use `#16A34A` for correct states and for additional grammatical elements such as adjectives, adverbs, relative clauses, and valid supporting phrases. Keep green tied to a clear semantic explanation.

### Dark ink: neutral content

Use `#1F2A37` for ordinary sentence text, bullets, arrows, icons, headings, and symbols. Neutral content should remain the visual majority.

### Muted gray: explanation

Use `#6B7280` for subtitles, secondary descriptions, annotation labels, and supporting guidance. Do not use it for essential body copy at small sizes.

Do not use the three semantic colors as generic brand accents, decorative gradients, or arbitrary button variants. A user should be able to predict what a color means.

## Component patterns

### Subject and main verb lockup

The deck repeatedly presents the formula `SUBJECT + MAIN VERB` above or beside a short sentence example.

- Set the two labels in all caps, serif display, and regular weight.
- Color `SUBJECT` blue and `MAIN VERB` red.
- Keep the plus sign neutral dark ink.
- Leave a clear horizontal gap around the plus sign.
- Place the example beneath the lockup with at least `--space-6` of separation.
- Color the matching subject and verb words in the example with the same semantic tokens.

```html
<div class="grammar-lockup" aria-label="Subject plus main verb">
  <span class="grammar-lockup__subject">SUBJECT</span>
  <span class="grammar-lockup__operator">+</span>
  <span class="grammar-lockup__verb">MAIN VERB</span>
</div>
<p class="sentence-example">
  <span class="subject-mark">The dog</span>
  <span class="verb-mark">barked.</span>
</p>
```

### Inline word highlighting

Use color directly on the relevant word or phrase while leaving the remainder of the sentence in neutral ink. Underlines may be added when the deck uses an arrow or explicit callout, but do not underline every colored term.

```css
.subject-mark { color: var(--color-subject); }
.verb-mark { color: var(--color-verb); }
.positive-mark { color: var(--color-positive); }
```

### Annotation with arrows

The deck uses thin muted arrows to connect labels to words.

- Use a 1.5px to 2px line in `--color-muted`.
- Keep arrowheads small and quiet.
- Center the label under or above the referenced word.
- Use serif display for an editorial annotation or UI sans for a compact diagram label, but keep the choice consistent within a component.
- Prefer CSS borders, SVG, or a dedicated diagram layer over text glyph arrows.
- Keep diagrams short and spacious; never let connectors cross through sentence text.

### Correct and incorrect lists

The practice examples use a simple bulleted list, later paired with large check and cross symbols.

- Keep the list text in serif display.
- Use neutral dark bullets for the ungraded state.
- Use a strong check or cross icon in dark ink, with the adjacent status label colored green or red only when the state needs to be explicit.
- Preserve generous line spacing for wrapped examples.
- Align icons on the first text line, not in the vertical center of a multi-line item.

### Question card

ACT-style question slides place source content inside a white rounded rectangle against the warm canvas.

```css
.question-card {
  max-width: 42rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  border: 0;
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
  font-family: var(--font-source);
}
```

- Use white surface contrast rather than a visible border.
- Keep the radius soft and modest, approximately 12px on the web.
- Use serif source text and lettered answer options.
- Keep citation text small, bold, and aligned to the lower right when a source is shown.
- Allow the card to breathe; do not fill every corner with controls or decoration.
- If highlighting answer choices, reuse the blue, red, and green semantic system instead of adding new colors.

### Summary and transition sections

Summary slides are quiet: a centered heading, a short left-aligned list, and ample surrounding whitespace. Transition slides may contain only a centered phrase such as `Up Next`.

- Use a serif display heading in neutral ink.
- Keep summaries to a small number of bullets.
- Use hyphen-style list markers or simple bullets, not dense UI list treatments.
- Give the section more vertical space than content strictly requires.

## Borders, radius, and depth

- Default to no border on lesson content, sentence examples, and summaries.
- Use the white rounded surface only for contained source-question content or a clearly grouped interactive panel.
- Use `0.75rem` as the default card radius; do not use pill shapes.
- Keep shadows off by default. If a floating interactive panel requires separation, use a very soft shadow with low opacity and no colored tint.
- Use subtle borders only for form fields, keyboard focus, or regions that need extra structure on smaller screens.
- Avoid gradients, glass effects, thick outlines, and decorative corner treatments.

## Interaction and states

The slides are static, so website interaction should remain understated.

```css
:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--color-focus-ring) 32%, transparent);
  outline-offset: 3px;
}

a {
  color: var(--color-subject);
}

a:hover {
  color: var(--color-verb);
}
```

- Use blue for links and primary focus indication.
- Use green for a correct or completed result.
- Use red for an incorrect result, validation issue, or main-verb-specific warning.
- Keep hover changes small: color shift, underline, or a slight contrast change is enough.
- Never rely on color alone for correct/incorrect states; pair it with text, an icon, or a label.
- Preserve readable contrast against `#F7F7F5` and `#FFFFFF`.

## Responsive behavior

- On wide screens, preserve the centered slide-like stage and generous margins.
- At tablet widths, reduce outer padding before reducing type size.
- On narrow screens, stack subject/main-verb lockups and annotation labels vertically when the horizontal version becomes cramped.
- Let question cards use nearly the full available width while preserving at least `1rem` of page padding.
- Keep sentence examples from wrapping between a highlighted word and its punctuation when possible.
- Maintain the semantic colors at every breakpoint; do not replace them with a new mobile palette.

## Usage rules

### Do

- Use serif display typography as the visual voice of instructional content.
- Keep the canvas warm, quiet, and spacious.
- Repeat the blue/subject, red/verb, green/positive mapping consistently.
- Use neutral dark ink for the majority of content.
- Separate source-question cards from the canvas with white surface contrast.
- Use arrows and labels only when they clarify a relationship.

### Do not

- Add a broad new color palette without a semantic need.
- Use blue, red, or green as arbitrary decorative accents.
- Replace the serif-led voice with a fully sans-serif interface.
- Use heavy shadows, glassmorphism, gradients, or pill-heavy controls.
- Pack examples tightly or center long reading paragraphs.
- Treat every highlighted word as a link or interactive control.

## Starter token block

```css
:root {
  --color-canvas: #F7F7F5;
  --color-surface: #FFFFFF;
  --color-ink: #1F2A37;
  --color-muted: #6B7280;
  --color-subject: #2563EB;
  --color-verb: #DC2626;
  --color-positive: #16A34A;
  --color-border-subtle: rgba(31, 42, 55, 0.14);
  --color-focus-ring: #2563EB;
  --font-display: "Libertinus Serif Display", "Libertinus Serif", Georgia, "Times New Roman", serif;
  --font-ui: "Libertinus Sans", Arial, Helvetica, sans-serif;
  --font-source: "Times New Roman", Times, Georgia, serif;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --radius-card: 0.75rem;
  --radius-control: 0.5rem;
  --shadow-card: none;
}
```

