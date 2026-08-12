# Theming

Theme management uses `next-themes` with CSS custom properties as design tokens. This document also covers fonts, contrast, focus visibility, and reduced-motion expectations that affect Lighthouse Accessibility and Best Practices scores.

Contribution entry point: [CONTRIBUTING.md](../CONTRIBUTING.md). Architecture context: [ARCHITECTURE.md](./ARCHITECTURE.md). Markup and accessibility behaviour: [SEO.md](./SEO.md).

---

## Theme Modes

Provisioned:

- Light — active in Release 1
- Dark — provisioned; real styles deferred
- System — provisioned; disabled in Release 1

### Release 1 policy

- No user-facing theme toggle
- `ThemeProvider` uses `forcedTheme="light"` so the document stays light even if preference storage or DevTools request another value
- Dark CSS variables intentionally mirror light tokens so a stray `.dark` class cannot leave semantic utilities unresolved
- When dark theme ships: define real `.dark` token values, remove `forcedTheme`, and optionally re-enable `enableSystem` / a toggle

---

## Theme Provider

Initialized via `components/providers/theme-provider.tsx`, mounted in `app/[locale]/layout.tsx`.

Release 1 configuration:

- `attribute="class"` — applies `.light` / `.dark` on `<html>`
- `defaultTheme="light"`
- `forcedTheme="light"`
- `enableSystem={false}`
- `themes={["light", "dark"]}`

`<html>` must include `suppressHydrationWarning` to avoid mismatch warnings from the theme bootstrap script.

### Hydration safety

Server-rendered and client-rendered output must stay consistent. Be careful with theme detection, `window`, `document`, random values, and timestamps. Do not render theme-dependent UI that disagrees with the server markup before theme state is available where that would cause hydration errors. Follow the provider patterns above when expanding beyond forced light mode.

---

## Design Tokens

Components must use semantic tokens such as:

- `background` / `foreground`
- `primary` / `primary-foreground`
- `secondary` / `secondary-foreground`
- `muted` / `muted-foreground`
- `border`
- `destructive` / `destructive-foreground`

Do not depend on hardcoded colour values in components.

Tokens are defined as CSS variables in `app/globals.css` (placeholders pending approved brand tokens) and registered with Tailwind via `@theme inline` so utilities such as `bg-background` resolve to the active theme.

Dark variant wiring:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Prefer semantic tokens over `dark:` colour overrides in components so theme switches only require CSS variable updates.

### Usage

```tsx
<div className="bg-background text-foreground">
```

Avoid:

```tsx
<div className="bg-white text-black">
```

---

## Fonts

Use `next/font` instead of loading fonts through unnecessary external requests.

- Load only required families and weights.
- Avoid blocking render with unnecessary font requests.
- Keep typography usable while fonts load.
- For multilingual surfaces, ensure selected fonts cover all supported scripts ([INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md)).

Font loading must not introduce large Cumulative Layout Shift. Prefer stable metrics and loading strategies that keep layout predictable ([ARCHITECTURE.md](./ARCHITECTURE.md)).

---

## Color Contrast

Text and important UI elements must meet WCAG AA contrast expectations against their backgrounds. Token choices should preserve contrast in every supported theme. Do not communicate meaning with colour alone; pair colour with text or another semantic indicator ([SEO.md](./SEO.md)).

---

## Focus States

Interactive elements must show a visible focus indicator. Do not use `outline: none` (or equivalent) without an accessible replacement focus style that remains keyboard-visible.

---

## Motion

Respect reduced-motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable or shorten non-essential animation */
}
```

Animations must not interfere with reading, navigation, interaction, focus, or comprehension.

---

## Adding a Theme

1. Define the required CSS variables.
2. Register the theme in the provider configuration.
3. Verify all semantic tokens resolve, including contrast.
4. Regression-test existing components and hydration behaviour.
5. Do not introduce theme-specific styling inside components.
6. For Release 1+, remove `forcedTheme` before exposing a user-facing toggle.

---

## Related Documentation

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [SEO.md](./SEO.md)
- [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md)
- [CHANGELOG.md](./CHANGELOG.md)
