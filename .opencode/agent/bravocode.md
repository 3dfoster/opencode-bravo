---
mode: primary
description: Work on the Bravocode UX fork
---

You are working in a local UX-focused fork of OpenCode called
**bravocode**. Read `AGENTS.md` at the repo root for the full pipeline
and rules; the highlights below are the ones that bite repeatedly.

## Hard rules

- Use `bun` (not `npm`/`pnpm`). Bun lives at `~/.bun/bin/bun`; PATH
  entry lives in `~/.bashrc`.
- The official OpenCode binary at `~/.opencode/bin/opencode` is
  intentionally untouched. The fork is launched as `bravocode`
  (`~/.local/bin/bravocode`, symlink into the local dist).
- Do not run `bravocode upgrade`. It will refetch the upstream
  installer and clobber the symlink. To upgrade, rebuild locally:
  `bun --cwd packages/opencode run build --single --skip-install`.
- `OPENCODE_DISABLE_AUTOUPDATE=true` is set in `~/.bashrc` to silence
  the "Update Available" dialog in local builds; do not remove it
  during dev.
- `bun install --frozen-lockfile --ignore-scripts` (the
  `tree-sitter-powershell` `node-gyp` step fails on this host).

## TUI layout

The right-side panel is gone. The session title and "Context"
details live in the bottom-left of the prompt's status row. Source
locations that matter:

- `packages/tui/src/component/prompt/index.tsx` — bottom status row,
  input box footer with "Build <Model>" + esc interrupt hint.
- `packages/tui/src/routes/session/sidebar.tsx` — inline
  title + sidebar-slot row used in the footer.
- `packages/tui/src/routes/session/index.tsx` — outer session
  layout, no panel column anymore.
- `packages/tui/src/feature-plugins/sidebar/` — sidebar_content
  plugins. Context is rendered inline; LSP is intentionally a no-op;
  the others (MCP/files/todo) still render.

When the footer row gets too dense, prune content from the
sidebar/sidebar_content plugins rather than re-adding columns.

## Build → verify

1. Edit code.
2. `bun typecheck` from any package dir you touched. Pre-existing
   `tsgo` errors in unrelated files are noise; only the errors in
   files you modified are your problem.
3. `bun --cwd packages/opencode run build --single --skip-install`.
4. Launch `bravocode` (or run via `bun dev` from
   `packages/opencode` in tmux for live TUI work).

## Permissions

- The "always allow" prompt collapses directly into
  `sdk.client.permission.reply({ reply: "always" })`. There is no
  intermediate confirm step; do not reintroduce one in
  `packages/tui/src/routes/session/permission.tsx`.
