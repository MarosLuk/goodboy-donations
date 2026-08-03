# GoodBoy Donations

A donation form for the GoodBoy Foundation, which supports Slovak dog shelters. You pick
whether the money goes to the foundation or to one shelter, choose an amount, leave your
details (yours, or several people's), agree to the processing of them, and send it. There is
a contact page, and an about page carrying the total raised so far and the number of donors.

Built with Next.js 16 on the App Router, React 19, TypeScript and styled-components. There
is no backend of my own: everything goes to the assignment API.

## Running it

```bash
cp .env.example .env.local
npm install
npm run dev
```

That serves the app on http://localhost:3000 and redirects to `/sk`. Both variables in
`.env.example` are documented in the file itself; they are parsed once through zod at
startup, so a missing or malformed one stops the app rather than surfacing as a confusing
fetch error later.

`npm run validate` is the one command worth remembering — typecheck, lint and tests in one
go. There are also `npm run build`, `npm run format`, and `npm run test:watch` while
working on something.

## How it is put together

```
src/
  app/[locale]/       routes: the form, contact, about, the og images
  features/           donation, shelters, results, contact
  components/         ui primitives, icons, layout
  lib/                api client, query client, env, formatting
  styles/             theme, palettes, global style
  i18n/               config and the sk/en locale files
```

The three folders under `features/` are vertical slices: each keeps its own components,
hooks, API calls and schema together, because that is what actually changes together. Two
rules keep them from turning into a tangle. A feature never imports from another feature —
anything two of them need moves down into `components/ui` or `lib`. And `components/ui`
knows nothing about donations, shelters or the API, which is why the shelter picker reaches
the form as a slot passed in from the page rather than as an import.

Every request goes through `lib/api` and the hooks in `features/*/api`. No component
calls `fetch`.

## Decisions worth knowing about

**The wizard step lives in the URL** as `?step=`, which is what makes per-step titles and
descriptions possible: the metadata is generated on the server from the query parameter, the
first step arrives as a prop, and from there the URL is kept in step through the History API.
No `useSearchParams`, so no Suspense bailout. A deep link is clamped to the furthest step
reached, so nobody skips validation by editing the URL.

**Form state is split on purpose.** React Hook Form owns the fields of the step you are
looking at; a small Zustand store owns what survives moving between steps — the draft, how
far you got, whether it was sent. Mixing the two into one store would mean re-validating
everything on every keystroke, and keeping the whole form mounted at once would mean
validating fields nobody has seen yet.

**Colours resolve through CSS custom properties.** `styles/palette.ts` holds the design's
base roles and its inverse ones, and the global style writes both sets as custom properties.
Every colour in the theme points at one of those names, so the dark scheme is a media query
and an attribute rather than a second theme object — nothing re-renders when it switches.
The system preference decides on its own; the toggle in the footer records a choice, and a
small blocking script applies a remembered one before the first paint so the page does not
flash. Three roles the design token set does not have had to be invented, each with the
reasoning next to it: what sits on top of a filled button, what a panel floating over the
page sits on (a shadow lifts things on white, not on black), and the ink the shadow scale
is built from.

**Accessibility got the same attention as the layout.** Moving between steps moves focus to
the new heading, so a keyboard or screen reader lands where the eye does. The shelter picker
is a real ARIA combobox with `aria-activedescendant` rather than a div listening for clicks.
Errors are tied to their fields through `aria-describedby`, the consent checkbox is a native
input painted over, and the confirmation is announced. Animations run through
`MotionConfig reducedMotion="user"`, so a system-level preference for less motion is
honoured without a prop on every component — the totals on the about page count up to their
figure for everybody else and simply arrive at it for anyone who asked for less.

**Two i18next instances, not one.** The server renders with a plain instance; only the
client one gets `initReactI18next`. They were one until the production build failed on
`createContext is not a function`, which is React trying to run in a place it cannot.

## Security

**The headers that never change with the request are in `next.config.ts`.** HSTS for two years
with subdomains, `nosniff` so a response is the type it says it is, a referrer policy that hands
a cross-origin destination the origin and never the step of the form, an empty permissions
policy because nothing here asks for a camera or a location, and `DENY` on framing — a donation
form is the kind of page clickjacking is aimed at. The header announcing the framework and its
version is turned off.

**The policy carries a nonce, which is why it lives in `src/proxy.ts`.** Next writes inline
scripts of its own, the flight payload among them, so a policy naming no inline script would
serve markup that never hydrates, and one allowing every inline script would protect nothing. A
nonce minted per request names exactly those and nothing an injection could add, and
`strict-dynamic` lets them pull the chunks they import without every bundle being listed by
hand. The layout reads the nonce back off the request and hands it to the one inline script this
app contributes, the line applying a remembered colour scheme before the first paint.
`connect-src` names the assignment api and nothing else; `object-src`, `base-uri` and
`frame-ancestors` are closed.

**It cost the prerender.** A nonce baked in at build time would not match the header a visitor
arrives with, so reading the request is what holds every page to rendering on demand, and the
about and contact pages gave up being prerendered. Two pages that fetch nothing on the server,
against a policy that stops an injected script from running — I would make that trade again.

The 404 screen could not simply give it up, and that took longer to work out. A url matching no
route is answered above the routing tree, where `[locale]` has nothing to fill it with, so the
framework renders a shell of its own: prerendered, without a nonce, every script in it refused.
`experimental.globalNotFound` exists for that exact case, and `app/global-not-found.tsx` is the
answer — it owns its whole document, so the language, the font, the theme and the colour scheme
script are all set up there a second time.

**`style-src` is the one place inline is still allowed**, and a nonce there would have been
theatre. Motion animates through the style attribute and `next/image` sizes itself the same way,
and a policy that names a nonce stops honouring `unsafe-inline` at all, so the two cannot be had
together. The directives that would separate an element from an attribute, `style-src-elem` and
`style-src-attr`, are Chromium's alone, and reaching for them would have cost Firefox its
animations. With `img-src` and `connect-src` closed, injected css has nowhere to send what it
reads, and `script-src` is where a policy earns its keep.

**What the browser is left holding is almost nothing.** The wizard store is not persisted, so a
donor's name, e-mail and phone never leave memory; `localStorage` holds the colour scheme and
that alone, validated on the way back in. Only the step is in the url, so no personal data
reaches browser history, a `Referer` or a server log. There are no cookies at all, which is also
why there is no banner to argue about. Nothing loads from a third party — no analytics, no cdn,
the fonts are self-hosted — which is what makes a policy this narrow possible in the first
place. One place in the app writes html directly and what it writes is a constant, so nothing an
api returns is ever rendered as markup.

### What a production version would still need

**The schema does not say everything it should.** The api accepts `firstName: "A"`,
`phone: "abc"` and `value: 0` with a 200, so the rules in `schema/donation.ts` are the only ones
there are, and three that belong there are not. The e-mail has no upper bound at all, where the
address itself stops at 254 characters. The amount has a floor of one but nothing marking it a
whole number, so the rule this project claims for itself lives in the input handler stripping
non-digits rather than in the schema. The donor array has a floor and no ceiling. None of the
three can be reached through the ui as it stands, which is the reason to write them down rather
than a reason not to: they are guarded by a component instead of by the thing meant to guard
them. The inputs carry no `maxLength` either, so a pasted megabyte is caught at validation
instead of at the keystroke.

**The donation is posted straight from the page**, which is what the assignment asks for and not
what a real one would do. There is nowhere to put a rate limit, a bot check or an idempotency
key: a double submit is stopped by a synchronous ref and a disabled button, and both of those
live in the browser, where anyone can decline them. That work belongs in a route handler of my
own, which is also the only place a credential could live — anything named `NEXT_PUBLIC_*` is
inlined into the bundle by definition.

**Nothing reports a violation.** The policy has no `report-to` and no collector behind it, so
the next tightening that breaks a page breaks it quietly. A real version runs a second, stricter
policy in report-only beside the live one and watches what comes back. That is also the only
honest way to try `require-trusted-types-for 'script'`, the strongest control still on the table
here — one html sink in the whole app, and a constant going into it.

**The consent is a checkbox and nothing more.** Informed consent needs a privacy notice to point
at, a named controller, a purpose and a retention period, and none of those exist to be written
down. The form also collects the details of further donors, and whoever fills it in cannot
consent on their behalf. Both are answers a foundation gives, not a frontend.

**The rest is operational.** `npm audit` reports three high advisories, all transitive through
Next and none of them reachable — `next/image` only optimises the images that ship with the
build, and postcss never runs outside the build, over this repo's own source — but nothing
watches for the fix, so a Renovate or Dependabot config belongs here. The workflow pins its
actions to tags rather than commit hashes and asks for no explicit `permissions`. `main` accepts
a force push.
And a form this full of personal data means whatever error tracking gets added has to scrub
request bodies first, or the incident tooling becomes a second copy of the donor list.

## Where it differs from the assignment

The brief says the donor's name is optional. The API disagrees: a missing **or empty**
`firstName` comes back 400, so the donation cannot be sent without one. Name is required
here.

The brief allows any amount and the API accepts `value: 0` with a 200 and writes the record.
A donation of nothing is not a donation, so the minimum is one euro, and amounts are whole
euros — the design shows a whole number and every preset is one.

The brief's length limits — 2–20 for the name, 2–30 for the surname — and the phone format
are enforced on the client only, because the server enforces none of them: `firstName: "A"`
and `phone: "abc"` both come back 200. The phone is validated as nine digits and sent in
E.164 form.

When you choose to give to one specific shelter, picking the shelter is required. The API
would happily take `shelterID: null` alongside that choice, and the money would quietly go
to the foundation instead of where you meant it.

## Where it differs from the design

The phone prefix is 116 px wide instead of the 80 px in the design, because at 80 px `+421`
is cut off mid-glyph. I measured it in the browser rather than guessing, widening until
`scrollWidth === clientWidth`.

The footer keeps the social icons on every page. In the design they appear only under the
first step, and a footer that changes between pages reads as a bug. They are not links —
the foundation's profile addresses are not in the assignment, and a link to nowhere is
worse than a picture.

The prefix flags are emoji, because the export has no flag assets. On Windows they render as
"SK" and "CZ" letters.

The design draws the first step in one state only: giving to the whole foundation, with the
shelter field present and labelled optional. Everything about the other half of that
segmented control is mine — that choosing a shelter becomes required, that the label drops
its optional marker, and that the field searches the list rather than scrolling it. The
endpoint takes a `?search=` parameter and there are sixteen shelters, so a combobox is what
the data asks for.

The error state is mine as well — the design does not show one. A field in error gets a
border and a message below it, painted with an inset shadow so the control keeps its exact
height instead of jumping by two pixels when the message appears.

There is no screen for what happens after a successful donation either, so that one follows
the rhythm of the form: a heading, a line naming what was sent and to whom, and a way back
to give again.

On the about page the two figures are exact — size, weight, centring and the rules above and
below all come from the design file. What surrounds them is mine: it borrows the contact
page's rhythm, which is specified, and the paragraphs run the full width the frame draws
them at.

The 404 screen is mine as well. It follows the confirmation's rhythm, which is the other
screen the design does not draw — a heading, one line saying what happened, and the way out —
and because three lines cannot fill a window the way the other screens do, they sit in the
middle of the room instead of leaving a void under them. The footer stays, so an address that
led nowhere is still somewhere a visitor can navigate from.

The og image is set in a system sans rather than Inter, because Satori needs the font as a
buffer and no font file came with the design.

The mobile layout for steps 2 and 3 is mine too — the design only covers the first step on a
phone. The hero photo is cropped to a landscape band there and dropped entirely on the later
steps, where it would otherwise cost a screenful of scrolling to reach the fields.

## Two things beyond the assignment

**Dark mode.** The design has no dark screens and no toggle, but its token set carries a
complete inverse palette, which is a strong hint one was intended. The system preference
decides on its own and the toggle in the footer overrides it. Three roles had to be invented
because the token set has no answer for them; the reasoning sits next to each in
`styles/palette.ts`.

**A language switcher.** Both locale files were complete from the start, but only the
`accept-language` header could pick between them, so the English half of the app was
unreachable from inside it. The pair of links in the footer swaps the locale segment and
keeps the rest of the path.

## What is not there

The results endpoint reads from a database shared by everyone working on this assignment, so
the two figures on the about page are real but small, and they move when somebody else
donates rather than only when you do.

Server-side validation is thin, as the differences above describe, which means the client is
the only thing standing between a typo and the database. What that leaves open, and what is
still missing on this side of it, is under Security.

The copy in the design is Slovak only, so the English strings are my translations.

## Quality gates

`husky` runs ESLint and Prettier over staged files before each commit, and `commitlint`
checks the message — the history follows
[Conventional Commits](https://www.conventionalcommits.org/). GitHub Actions runs typecheck,
lint, a format check, the test suite and a production build on every push and pull request,
on Node 22.

Tests are Vitest with Testing Library, and the network is mocked with msw configured to fail
on any request it was not told about, so a test reaching for the real API is a failure rather
than something that quietly passes. The suite covers the schema, each step, the components
that hold state, and the whole flow from an empty form to the recorded payload.
