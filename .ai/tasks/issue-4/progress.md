## Progress
- Repo located and cloned.
- Confirmed Payload is already initialized and `Media` already exists.
- Added a minimal `Pages` collection and registered it in `payload.config.ts`.
- Added lightweight collection tests for `Pages` and `Media`.
- `pnpm test -- --runInBand` passes.
- Addressed review feedback: guest read access for `pages` is now restricted to published docs only, while editors keep full read access.
- `pnpm exec tsc --noEmit` fails on pre-existing syntax errors in `src/globals/Contact.ts` and `src/globals/GlobalSettings.ts`, outside this change.
