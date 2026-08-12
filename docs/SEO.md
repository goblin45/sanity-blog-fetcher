# SEO, Semantic HTML, and Accessibility

This document defines project standards for semantic HTML, accessibility-oriented markup behaviour, Next.js metadata, and related SEO practices.

It is the single source of truth for markup structure, interactive accessibility expectations tied to HTML, and metadata. Contribution workflow and the broader documentation map live in [CONTRIBUTING.md](../CONTRIBUTING.md). Locale-specific metadata rules also appear in [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md); keep both documents aligned when localization behaviour changes. Visual tokens, focus styling, contrast, fonts, and reduced motion are specified in [THEMING.md](./THEMING.md).

> Principle: HTML describes meaning and structure. CSS controls appearance. Metadata describes the page accurately and must never invent content that is not present on the page. Accessibility is implemented during component development, not as a final audit-only step.

---

## 1. General Principles

1. Prefer semantic elements over generic `<div>` and `<span>`.
2. Choose elements for meaning, not default appearance.
3. Do not select heading levels based on font size.
4. Use `<a>` (or Next.js `<Link>`) for navigation and `<button>` for actions.
5. Maintain a logical heading hierarchy and landmark structure.
6. Provide meaningful `alt` text for informative images; use empty `alt` for decorative images.
7. Keep important content in server-rendered HTML rather than injecting it only after client-side JavaScript.
8. SEO markup must accurately represent visible content. Do not keyword-stuff headings, links, URLs, or `alt` text.
9. Prefer native interactive controls; add ARIA only when native semantics are insufficient.

---



## 2. Page Document Structure

```html
<body>
  <header>
    <nav aria-label="Primary navigation">
      <!-- Primary navigation -->
    </nav>
  </header>

  <main>
    <!-- Page-specific content -->
  </main>

  <footer>
    <!-- Site footer -->
  </footer>
</body>
```

Rules:

- One primary `<main>` per page
- Site-wide chrome belongs in `<header>` / `<footer>`, not inside `<main>`
- Primary navigation uses `<nav>`; label multiple nav landmarks with `aria-label`
- Additional `<header>` / `<footer>` elements may appear inside `<article>` or `<section>` when appropriate



### Landmarks and sections


| Element     | Use when                                                                    |
| ----------- | --------------------------------------------------------------------------- |
| `<section>` | Thematic grouping that generally has a heading—not as a styled `<div>`      |
| `<article>` | Self-contained content that could stand alone (blog post, case study entry) |
| `<aside>`   | Complementary content not required to understand the primary content        |
| `<nav>`     | Important navigation groups only                                            |


Reusable components must preserve semantics (for example `as="article"` or dedicated semantic wrappers). Do not force visual card patterns to erase meaning.

---



## 3. Heading Hierarchy

```text
h1
 ├── h2
 │    ├── h3
 │    └── h3
 └── h2
      └── h3
```

- Each page should have one clear primary `<h1>` describing the page subject.
- Use `<h2>` for major sections and lower levels for subsections.
- CSS controls size; heading level controls structure.
- Headings must be descriptive. Avoid vague labels such as “More”.

---



## 4. Links, Buttons, and Internal Linking

- Navigation → `<Link>` / `<a>` with descriptive link text (avoid “Click here” and repeated vague “Read more”).
- Actions → `<button type="button|submit">`. Do not use `<a href="#">` for actions.
- Do not use buttons as navigation or anchors as generic action controls.
- Important pages must be reachable through real HTML links, not only JavaScript handlers or buttons.
- Prefer crawlable internal links that reflect the information architecture.
- For localized navigation, use the project's locale-aware navigation helpers ([INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md)).

Breadcrumbs, where hierarchy warrants them:

```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/services">Services</a></li>
    <li aria-current="page">Web Development</li>
  </ol>
</nav>
```

When opening external resources in a new tab, use `rel="noopener noreferrer"`. Use new-tab behaviour only when it improves UX.

---



## 5. Images, Lists, Forms, and Tables

- Prefer Next.js `<Image>` for application-managed images.
- Informative images need descriptive `alt`; decorative images use `alt=""`.
- Do not replace page copy with text baked into images when HTML text is feasible.
- Do not keyword-stuff `alt` attributes.
- Use `<ul>` / `<ol>` / `<dl>` for real lists; `<table>` only for tabular data (with captions and scoped headers where appropriate).
- Forms need associated `<label>` elements; placeholders are not labels. Provide meaningful error messages, validation states, instructions, and success feedback.
- Prefer native interactive controls over `div` + `role` recreations. Incorrect ARIA is worse than no ARIA.

---



## 6. Accessibility Behaviour



### Keyboard

All interactive functionality must be usable with a keyboard. Verify Tab order, Enter/Space activation where appropriate, Escape for dialogs and menus, focus visibility, and logical focus order.

Do not create interactive controls with non-interactive elements such as `<div onclick="...">`. Prefer native controls.

### Accessible names

Interactive elements must have meaningful accessible names. Icon-only controls need an accessible name (for example `aria-label`). Prefer visible text when possible.

### Color and meaning

Do not communicate important information with colour alone. Pair colour with text or another semantic indicator. Contrast requirements: [THEMING.md](./THEMING.md).

### Focus and motion

Visible focus states are required. Do not remove outlines without an accessible replacement. Respect `prefers-reduced-motion`. Details: [THEMING.md](./THEMING.md).

---



## 7. Metadata Requirements (Next.js App Router)

Every publicly accessible, indexable page must define appropriate SEO metadata through the App Router Metadata API (`metadata` or `generateMetadata`). Do not hand-author `<title>` / `<meta>` tags inside page components when the Metadata API can express them. Do not inject metadata through client-side JavaScript.

- Prefer static `metadata` when values are known at build time.
- Use `generateMetadata` when values depend on route params, locale, or fetched content.
- Define metadata at the appropriate route level; inherit defaults from the root layout where possible.



### Required fields

Every indexable public page must define, directly or by inheritance:

- `title`
- `description`
- `metadataBase` (typically at the root)
- `alternates.canonical`
- `openGraph`
- `twitter`

Add `keywords`, `robots`, `authors`, `creator`, `publisher`, or `category` only when they serve a real SEO or sharing purpose.

Central helpers belong under `lib/seo/` so routes override only page-specific values:

```text
Root layout defaults
  → Section / locale layout
    → Page metadata
      → Dynamic generateMetadata
```



### Titles

- Unique and descriptive; avoid generic values such as `Home` or `Welcome`.
- Avoid keyword stuffing; keep titles concise for SERP display.
- Use a site-wide title template from the root layout; pages supply only the page-specific segment.

```ts
title: {
  default: "Project Name",
  template: "%s | Project Name",
}
```



### Descriptions

- Unique per page; written for users first.
- Approximately 150–160 characters when practical, without sacrificing clarity.
- No placeholders, no blind duplication across unrelated pages, no heading concatenation as a substitute for a real summary.



### Canonical URLs

- Absolute resolution via `metadataBase` and the preferred production domain.
- Do not derive canonicals from untrusted request headers.
- Dynamic routes must resolve canonicals from actual route parameters.
- Localized pages must not collapse all locales into the default language’s URL.



### Open Graph and Twitter

Minimum Open Graph shape:

```ts
openGraph: {
  title: "...",
  description: "...",
  url: "...",
  siteName: "Project Name",
  type: "website", // or "article" when appropriate
  images: [{ url: "...", width: 1200, height: 630, alt: "..." }],
}
```

Twitter / X:

```ts
twitter: {
  card: "summary_large_image",
  title: "...",
  description: "...",
  images: ["..."],
}
```

Keep Twitter fields consistent with Open Graph unless there is a deliberate reason to differ. Social images need meaningful `alt` text and stable production URLs. For localized pages, social metadata must match the active locale.

### Robots

- Production public pages are indexable by default.
- Do not apply `noindex` without a documented reason.
- Generally exclude auth, admin, preview, duplicate, and utility surfaces.
- Never apply global `noindex` unless explicitly required.



### Dynamic pages

```ts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPage(params.slug);

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical: `/services/${page.slug}`,
    },
  };
}
```

Metadata must come from the actual content. Do not reuse one title/description across all dynamic pages. Handle missing content deliberately.

### Metadata ↔ content alignment

`<title>`, meta description, H1, and body content must describe the same primary subject. Do not target keywords that do not appear naturally in the page.

---



## 8. Internationalized SEO

Supported locales and routing conventions are defined in [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md). For SEO specifically:

- Each localized URL has localized metadata (titles, descriptions, social fields).
- Canonical URLs point to the correct locale-specific URL.
- Use `alternates.languages` (hreflang) for language variants of the same page.
- Do not treat translations as duplicate content of each other.
- Prefer translation dictionaries or shared metadata helpers over hardcoded per-locale strings in every page file.

---



## 9. Duplicate Content

Avoid unintentionally exposing the same page through multiple indexable URLs (for example bare `/about`, `/en/about`, and query variants such as `?lang=en` or tracking parameters treated as distinct pages). Routing and canonicalization must identify the intended indexable URL for each locale.

---



## 10. Structured Data

Where applicable, emit Schema.org JSON-LD that accurately mirrors visible content. Candidates include `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`, `Article`, `Service`, `Product`, `LocalBusiness`, `Event`, and `Person`.

- Never invent unsupported claims for rich-result targeting.
- Prefer centralized builders under `lib/seo/`.
- Localize structured data when the underlying content is localized.
- Validate before considering the work complete.

---



## 11. Sitemap and Robots

Maintain production `sitemap.xml` and `robots.txt` via Next.js metadata routes (`app/sitemap.ts`, `app/robots.ts`).

- Sitemap: canonical, indexable URLs only, including locale-prefixed public routes; production domain; avoid private pages and unnecessary duplicates; keep generation aligned with the route/content inventory.
- Robots: do not block important public pages or assets required for rendering; do not treat `robots.txt` as access control—protect private surfaces with authentication.

Site origin for absolute URLs comes from `NEXT_PUBLIC_SITE_URL` (see [ENVIRONMENT.md](./ENVIRONMENT.md)).

---



## 12. Error Pages and Crawlability

404 and error pages should remain semantic: clear heading, explanation, and a link back into the site. Important textual content for indexable pages must be present in the initial HTML. Prefer Server Components for static marketing content.

URL structure should be descriptive, stable, and hierarchical (for example `/en/services/web-development`). Avoid opaque query-only identifiers unless genuinely required. Keep path naming consistent across locales unless localized slugs are an explicit product decision.

---



## 13. Completion Checklist

Before considering a public page complete:

**Structure and accessibility**

- [ ] One primary `<main>` and a meaningful `<h1>`
- [ ] Logical heading hierarchy and appropriate landmarks
- [ ] Sections/articles used for meaning, not layout
- [ ] Interactive elements keyboard accessible with visible focus
- [ ] Links and buttons used correctly; interactive elements have accessible names
- [ ] Forms labelled with meaningful validation and error messaging
- [ ] Colour is not the sole indicator of meaning
- [ ] Motion respects `prefers-reduced-motion` ([THEMING.md](./THEMING.md))
- [ ] ARIA used only when necessary

**Navigation and content**

- [ ] Navigation uses links; actions use buttons
- [ ] Descriptive link text; important pages internally linked
- [ ] Informative images have appropriate `alt`
- [ ] Lists and tables used correctly
- [ ] Important copy is real HTML, not image-only or client-only injection

**Metadata and discovery**

- [ ] Unique title and meta description
- [ ] Canonical URL correct for production and locale
- [ ] Open Graph and Twitter metadata present
- [ ] Robots directives intentional
- [ ] Language alternates correct when localized
- [ ] Structured data accurate where used
- [ ] Page included or excluded from the sitemap correctly
- [ ] No accidental `noindex`, wrong canonical, or duplicate indexable URLs

---



## Related Documentation

- [CONTRIBUTING.md](../CONTRIBUTING.md) — contribution entry point and quality expectations
- [ARCHITECTURE.md](./ARCHITECTURE.md) — rendering, performance, and Core Web Vitals
- [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) — locales and dictionaries
- [ENVIRONMENT.md](./ENVIRONMENT.md) — `NEXT_PUBLIC_SITE_URL` and related variables
- [THEMING.md](./THEMING.md) — tokens, fonts, contrast, focus, and motion

