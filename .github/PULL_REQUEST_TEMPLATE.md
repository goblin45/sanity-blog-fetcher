## Summary

<!-- 1–3 bullets: what changed and why. Review the full commit range, not only the latest commit. -->

-

## Related issue

<!-- Example: #12 — or "N/A" with a one-line reason -->

-

## Type of change

<!-- Check all that apply -->

- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Documentation
- [ ] Tests
- [ ] Chore / tooling
- [ ] Security / performance

## Test plan

<!-- How reviewers (and you) should verify this PR -->

- [ ] `npm test` (unit) passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] Affected API routes/controllers have Jest coverage (required for new/changed APIs)
- [ ] Postman smoke completed for touched endpoints (if API surface changed)
- [ ] UI checked at ~300px and desktop (if UI changed)
- [ ] No new console errors / hydration issues on touched surfaces

## Screenshots / recordings

<!-- Required for user-facing UI changes; otherwise delete this section -->

|

## Checklist

- [ ] Branch naming follows `feature/…`, `fix/…`, or `refactor/…`
- [ ] Commit messages follow `#issue_no: message`
- [ ] Code follows [CONTRIBUTING.md](./CONTRIBUTING.md) / [AGENTS.md](./AGENTS.md)
- [ ] Secrets stay in Infisical only (no `.env` secrets committed)
- [ ] Relevant `docs/` updated (ARCHITECTURE, BACKEND, ENVIRONMENT, TESTING, INTEGRATIONS, CHANGELOG, etc.)
- [ ] New/changed env vars registered in [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md)
- [ ] New/changed third-party integrations documented in [docs/INTEGRATIONS.md](./docs/INTEGRATIONS.md)
- [ ] Meaningful product/architecture changes noted in [docs/CHANGELOG.md](./docs/CHANGELOG.md)

## Notes for reviewers

<!-- Risks, rollout, follow-ups, or anything not obvious from the diff -->

-
