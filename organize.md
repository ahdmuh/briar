# Organization Plan

Follow [`../STANDARDS.md`](../STANDARDS.md). This plan organizes the existing
repository; renaming the GitHub repository or product from Briar Bot to Briar
is a separate operation.

## Classification

Standalone JavaScript Discord service. It has one implementation and does not
need a `services/` collection.

## Critique

- `services/bot/` redundantly wraps the repository's only component.
- Root `package.json` exists only to delegate into a child workspace.
- Runtime icons are nested under the component instead of using canonical root
  assets.
- Tracked character reference data and ignored runtime cache are different
  concerns but are not clearly separated.
- Workflow names describe actions generically instead of stable targets and
  artifacts.
- Service filenames use hyphens rather than backend `snake_case`.

## Target

```text
briarbot/
├── .docker/
├── .github/
├── assets/
│   ├── shared/
│   └── discord/
├── data/                # Tracked character reference data
├── scripts/
├── src/
├── cache/               # Ignored runtime data
├── package.json
└── bun.lock
```

## Migration

1. Merge `services/bot/package.json` into the root manifest and remove the
   `services/*` workspace.
2. Move service source to root `src/`; update root scripts and Docker paths.
3. Move tracked icons into root `assets/discord/` and tracked character JSON
   into root `data/`. Update all runtime path resolution.
4. Convert automated tests into colocated `*.test.js` files beside the modules
   they test. Move interactive test runners to `scripts/`.
5. Rename backend JavaScript files to `snake_case` and update imports.
6. Rename `publish-container.yml` to `briar-image.yml` with display name
   `Briar · Image`.
7. Rename the character workflow to `characters-sync.yml` with display name
   `Characters · Sync`; avoid duplicating image publication logic between
   workflows.
8. Remove `services/` only after no references remain. Keep `cache/` ignored.

## Validate

```bash
bun install --frozen-lockfile
bun run test
docker build -f .docker/Dockerfile .
rg 'services/bot' --glob '!organize.md'
```

The final search must return no matches. If a startup smoke test is needed, use
a non-production Discord configuration; never commit `.env` or cache contents.
