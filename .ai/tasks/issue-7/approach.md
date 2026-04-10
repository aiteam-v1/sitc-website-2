## Understanding
Implement real language-prefixed routing for the site, with locale detection/redirect behavior, translation files, and html direction/lang handling for English, Urdu, and Sindhi.

## Plan
1. Inspect current next-intl setup and align it with the issue requirements.
2. Add locale message files and shared i18n helpers.
3. Create `[lang]` app layout/pages with html lang/dir behavior.
4. Update middleware to redirect bare paths and persist locale preference.
5. Add focused tests or validation for the routing helpers where practical.

## Edge cases
- Bare `/` and bare nested paths should resolve to a language-prefixed path.
- Urdu and Sindhi should render RTL.
- Keep scope to routing/static strings, not variant UI work.

## Questions
- None yet.
