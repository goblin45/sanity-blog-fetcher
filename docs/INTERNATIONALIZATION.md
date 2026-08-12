# Internationalization

Internationalization is an architectural concern. Do not implement language behaviour ad hoc inside individual pages or components.

Contribution entry point: [CONTRIBUTING.md](../CONTRIBUTING.md). Locale-aware SEO details: [SEO.md](./SEO.md).

The application uses **next-intl** for locale-aware routing and translations.

## Supported Locales

- `en` — English (default)
- `bn` — Bengali

---

## Locale-Based Routing

All public routes are locale-prefixed:

```text
/en
/en/about
/bn
/bn/about
```

Locale is a dynamic segment under `app/[locale]/`. The same page component renders per active locale.

### Detection and redirection

Requests without a locale (for example `/about`) are redirected to a locale-prefixed path based on stored preference or browser language, defaulting to `en`.

Locale detection and redirection belong at the routing/proxy layer. Translation logic must not live there.

---

## Translation Dictionaries

Static user-facing copy lives in:

```text
messages/
├── en.json
└── bn.json
```

Dictionaries must share the same key structure across locales. Keys describe meaning or purpose, not language (`About.hero.title`, never `About.englishTitle`).

### Static content rule

Do not hardcode user-facing copy in components. Use the translation APIs:

```tsx
const t = useTranslations("About");

<h1>{t("hero.title")}</h1>
<p>{t("hero.description")}</p>
```

**Belong in dictionaries:** navigation, headings, descriptions, CTAs, form labels and validation, errors, empty states, notifications, static page copy, footer, SEO metadata strings, accessibility labels.

**Do not put in dictionaries by default:** CMS/database/dynamic content (products, blog bodies, user-generated content). Those need their own localization strategy.

---

## Language Switching

Changing locale must preserve the current path (`/en/about` → `/bn/about`) and persist the preference for later visits. Do not bounce users to the home page unless the target locale lacks that route.

---

## Localized Metadata

Page metadata must respect the active locale. Prefer dictionary-backed or shared helpers over hardcoded per-page locale strings. Generate localized `title`, `description`, Open Graph, and Twitter fields as required.

Canonical and `alternates.languages` (hreflang) behaviour is specified in [SEO.md](./SEO.md). Each localized URL is a distinct indexable page; do not canonicalize every locale to the default language.

---

## Fonts and Scripts

Application fonts must cover all supported writing systems used in the UI. Load fonts through `next/font` and document family choices in [THEMING.md](./THEMING.md). Layouts must tolerate longer translations without breaking navigation or CTAs.

---

## Adding a Locale

1. Register the locale in the centralized next-intl / routing configuration.
2. Add a dictionary with the same key structure.
3. Translate all required static content and metadata.
4. Verify routing, language switching, hreflang relationships, and layouts (especially longer translations).
5. Confirm fonts render the new script correctly.

No page component should need language-specific branches merely because a locale was added.

---

## Principles

- Locale is part of the URL; `en` is the default
- next-intl owns translation and locale-aware routing
- Middleware/proxy owns detection and redirection, not translation
- Static copy uses translation keys; dictionaries stay structurally aligned
- No language-conditional rendering for ordinary copy
- Language switching preserves the current route
- Dynamic/CMS content is localized separately from UI dictionaries
- UI must tolerate varying string lengths across locales
- Fonts must support every active locale script
- New locales should not require rewriting existing page components

---

## Related Documentation

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [SEO.md](./SEO.md)
- [THEMING.md](./THEMING.md)
- [CACHING.md](./CACHING.md)
