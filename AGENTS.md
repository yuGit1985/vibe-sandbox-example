<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Prototype Sandbox Rules

This repository is for executable business prototypes, not production-ready applications.

## Boundaries

- Put user-facing UI in `src/ui`.
- Put user input boundaries, such as Server Actions, in `src/inputs`.
- Put application behavior in `src/usecases`.
- Define external capabilities in `src/ports`.
- Implement prototype-only external behavior in `src/fakes`.
- Access external capabilities from UseCases only through Ports.
- Do not bypass the dependency boundaries enforced by dependency-cruiser.

## Fake Adapters

- Fake adapters may use fixed values or in-memory state only.
- Do not access databases, filesystems, network services, or secrets.
- Do not reproduce production infrastructure behavior.
- Do not put business rules in Fake adapters.
- Prefer the smallest Fake implementation needed to demonstrate the scenario.

## Tests

- Add or update tests when behavior changes.
- Prefer UseCase tests for application behavior.
- UI tests are optional unless the behavior exists only in the UI.
- Do not consider work complete unless `pnpm check` passes.

## Completion

- Run `pnpm check` before finishing.
- If Biome fails only because of formatting, run `pnpm lint:fix` and then run `pnpm check` again.