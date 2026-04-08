## Understanding
Add the minimum Payload CMS collection setup needed to satisfy the current unblock request: keep `Media`, add a basic `Pages` collection, and ensure the Payload config includes it and boots cleanly.

## Plan
1. Inspect current Payload config and existing collections.
2. Add a minimal `Pages` collection with localized title/slug/content and public read/editor write access.
3. Register `Pages` in `payload.config.ts`.
4. Add lightweight collection tests for `Pages` and `Media`.
5. Run tests/lint or the smallest available validation command.

## Edge cases
- Keep scope tight, no globals refactor.
- Match existing access patterns and localization style.
- Avoid changing existing collections beyond what's needed.

## Questions
- None for now, repo state is clear enough to proceed.
