# Contract Request Wizard

A mobile-first, three-step **application & contract request wizard** built with React. It is designed around four engineering concerns: one unified form state across steps, RegEx-based real-time validation, crash-resilient draft autosave, and keyboard-safe layouts on mobile browsers and WebViews.

## Features

| Area                               | What it does                                                                                                                                                                |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Step 1 – User info**             | Name, contact number and email, each with its own RegEx rule and inline error.                                                                                              |
| **Step 2 – Request configuration** | Dynamic list of services: add, edit (service, quantity, note) and remove rows. At least one service is required and duplicates are rejected.                                |
| **Step 3 – Review & confirm**      | Read-only snapshot of every input with a cost estimate, "Edit" shortcuts back to earlier steps, then a mock submission.                                                     |
| **Linear step enforcement**        | "Next" validates only the active step's fields. Forward jumps are impossible, and going back is always allowed.                                                             |
| **Real-time validation**           | An error shows on first blur, then re-validates on every keystroke so it clears the moment input becomes valid.                                                             |
| **Draft autosave**                 | Values _and_ step position are written to `localStorage` on every change. A refresh or crash restores the exact state. The draft is cleared after a successful submit.      |
| **Mobile layout**                  | A sticky Previous / Next / Submit bar is pinned to the bottom of the screen and rides above the virtual keyboard. The focused input is re-centred after the keyboard opens. |

## Tech stack

- **React 19** + **TypeScript** on **Vite 8**
- **Tailwind CSS v4** + **shadcn/ui** (stock components: `field`, `input`, `select`, `textarea`, `card`, `button`, `progress`, `alert`, `sonner`, `spinner`, …)
- **react-hook-form** for form state, with **zod** schemas through `@hookform/resolvers`
- **Vitest** + **Testing Library** (jsdom) for unit and integration tests

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

To test on a phone on the same network, run `npm run dev -- --host` and open the printed network URL.

| Script              | Purpose                         |
| ------------------- | ------------------------------- |
| `npm run dev`       | Start the dev server            |
| `npm run build`     | Type-check and build to `dist/` |
| `npm run preview`   | Serve the production build      |
| `npm run lint`      | ESLint                          |
| `npm run typecheck` | `tsc -b`                        |
| `npm test`          | Run all Vitest suites once      |

Deployment via GitHub Actions is documented in [DEPLOYMENT.md](./DEPLOYMENT.md).

## Project structure

```
src/
├── components/
│   ├── layout/AppShell.tsx          # Viewport-pinned header / scroll area / footer
│   └── ui/                          # shadcn/ui components (unmodified)
├── hooks/
│   ├── useVisualViewport.ts         # visualViewport → CSS variables
│   └── useKeepFocusedVisible.ts     # Re-centres the focused input after keyboard resize
├── lib/                             # Framework-agnostic helpers (storage, format, delay)
└── features/wizard/
    ├── RequestWizard.tsx            # Composition root: shell + steps + footer
    ├── config/                      # Step metadata, service catalog, declarative field config
    ├── schema/                      # RegEx patterns and per-step zod schemas
    ├── hooks/                       # Form, navigation, autosave and orchestration hooks
    ├── lib/                         # Draft storage, resume-step guard, mock API, summaries
    ├── components/                  # Reusable field and wizard chrome components
    └── steps/                       # One component per step
```

Dependencies point one way: `steps → components → config/schema → lib`. Hooks hold the behaviour and components only render, so any layer can be tested or replaced on its own.

---

## Technical note

### 1. Managing form field schemas without component bloat

**One source of truth per concern**

- `schema/patterns.ts` holds the RegEx rules (`EMAIL_PATTERN`, `PHONE_PATTERN`, `NAME_PATTERN`) as named, unit-tested constants.
- `schema/userInfo.ts` and `schema/requestConfig.ts` are independent zod schemas, one per step. `schema/wizard.ts` merges them into a single `wizardSchema`, which drives one `useForm` instance and so one unified form state. The TypeScript type `WizardValues` is inferred from that schema, so types and rules cannot drift apart.
- Cross-field rules live in the schema rather than in components. Examples are "at least one service" and the `superRefine` duplicate check that reports on the offending row (`items.1.service`).

**Declarative steps and fields**

- `config/steps.ts` lists each step's title, description and owned `fields`. Navigation validates a step with `trigger(step.fields)`, so adding a step means adding a config entry and a component, not touching the navigation code.
- `config/userInfoFields.ts` describes step 1 as data: name, label, `type`, `inputMode`, `autoComplete`, `enterKeyHint`, and so on. `UserInfoStep` is just a `map` over that array into a generic, type-safe `TextField<T>`. A new text field is one config object.
- `TextField` is the only place that wires `Controller` to shadcn's `Field` / `FieldLabel` / `FieldError` / `FieldDescription` and to the ARIA attributes. Specialised inputs (`ServiceSelectField`, the quantity and notes fields in `ServiceItemCard`) follow the same pattern without repeating validation logic.

**Behaviour lives in hooks, not components**

- `useWizardForm` builds the form and restores the draft.
- `useWizardNavigation` handles linear step gating.
- `useDraftAutosave` persists the draft.
- `useRequestWizard` composes the three and owns submission.

`RequestWizard.tsx` is a ~60-line view layer as a result.

**Validation timing:** the form uses `mode: 'onTouched'` with `reValidateMode: 'onChange'`. Errors appear when the user leaves a field. From then on, every keystroke re-validates, so the message toggles off as soon as the input becomes valid. This avoids shouting "invalid email" at the first typed character while still giving instant feedback. Pressing **Next** validates and focuses the first invalid field of the step even if the user never touched it.

### 2. Cross-device viewport recalculation when the keyboard opens

Mobile browsers handle the virtual keyboard differently:

| Browser                  | Behaviour when the keyboard opens                                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Chrome / Android WebView | Can resize the _layout_ viewport.                                                                                                                |
| iOS Safari / WKWebView   | Only shrinks the _visual_ viewport and scrolls the page underneath, so `position: fixed` footers end up behind the keyboard or float mid-screen. |

The solution has four layers:

1. **Opt into layout resizing where supported.** `index.html` declares `interactive-widget=resizes-content` (plus `viewport-fit=cover` for safe areas). With it, Chromium shrinks the layout viewport, so `100dvh` already excludes the keyboard.
2. **Visual viewport as the source of truth.** `useVisualViewport` listens to `visualViewport` `resize` and `scroll` events, throttled with `requestAnimationFrame`. It writes `--app-height` (the visible height) and `--vv-offset-top` (how far iOS scrolled the layout viewport) to `:root`.
3. **Shell pinned to the visible area.** `AppShell` is a fixed flex column with `top: var(--vv-offset-top)` and `height: var(--app-height, 100dvh)`:
   - The header and the action bar are normal flex items, not `position: fixed` overlays.
   - Only `<main>` scrolls (`min-h-0 flex-1 overflow-y-auto`).

   When the keyboard opens, the column shrinks and the action bar sits directly on top of the keyboard. Because the footer is part of the flow, it can never cover an input. It only takes space away from the scroll area. Safe-area insets pad the header and footer.

4. **Keep the active input in view.** `useKeepFocusedVisible` waits for the keyboard animation to settle (`focusin` + `visualViewport.resize`, about 300 ms), then calls `scrollIntoView({ block: 'center' })` on the focused field inside `<main>`.

Some smaller details also help:

- Inputs render at 16px on mobile (shadcn's `text-base md:text-sm`), which prevents iOS's zoom-on-focus.
- `overscroll-behavior: none` stops rubber-banding from dragging the shell.
- `inputMode` and `enterKeyHint` bring up the right keyboard for each field.
- Changing steps resets the scroll position.

### 3. Autosave and restore

- **Write path:** `useDraftAutosave` subscribes to form value changes (`form.subscribe`) and step changes. It writes `{ version, step, savedAt, values }` **synchronously** on every change. There is no debounce, so a crash immediately after a keystroke loses nothing, and the payload is a few hundred bytes. Storage errors (quota, private mode, sandboxed WebViews) are swallowed because autosave is best-effort.
- **Read path:** `createDraftStorage().load()` parses the JSON and validates its _shape_ with a dedicated zod schema. Business rules are not applied at this point, so a half-typed email survives a reload. Malformed, outdated (`version` mismatch) or out-of-range drafts are discarded and removed.
- **Integrity on resume:** `resolveResumeStep` re-validates every step _before_ the saved one. If one no longer passes, for example after a schema change between releases, the wizard resumes at that step instead of the stale saved position. Linear enforcement therefore also holds across reloads.
- **Safe clear on submit:** autosave is disabled while a submission is in flight and after it succeeds. The draft is removed only _after_ the mock API resolves:
  - If submission fails, the draft stays and autosave resumes.
  - Nothing can re-write the draft between "clear" and the success screen.

  A ref guard also blocks double submits.

## Testing

- **Unit tests:** RegEx patterns (accepted and rejected samples), step schemas (trim, duplicates, bounds, catalog), draft storage (round trip, corrupt/old/out-of-range payloads, no-storage fallback) and the resume-step guard.
- **Integration tests** (`RequestWizard.test.tsx`, jsdom):
  - step gating
  - live error toggling
  - autosave plus restore after remount
  - the list-level "add a service" error
  - submit clearing the draft
  - resuming at the first invalid step
