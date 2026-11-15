# DSH Desktop Center V0.3 — Single-install Bundle

One DSH Bundle package containing a **real Web/Desktop sidebar panel** and separately versioned, read-only services:

- `desktopRegistry` — detects app/config candidates for eight AI Desktop targets, not CLI processes.
- `skillsHub` — lists Skills, hashes whole packages, and compares differences.
- `desktopCenter` — aggregate read-only view and authenticated Connection Fetch routes.

Declared host range: **DSH `>=0.2.1-rc.2 <0.3.0-0`**, Node >=22. Desktop acceptance covered DSH Desktop 0.2.2-rc.3 on arm64 macOS 26.4 and resource refresh in Qoder and Qoder CN 0.5.11. Other OS hosts display unsupported status.

## Install in DSH Desktop

1. Back up the current DSH profile and disable/uninstall the earlier **V0.2** two bundles, if present, to avoid duplicate provider names. Don't edit profile files manually.
2. In DSH **Plugins → Add plugin**, select a local package path and point to this folder if the current DSH build accepts local directories. Alternatively use Creator mode and tell DSH to call official `plugin_manager` with `action: install_bundle` and `target` set to the **absolute folder path** for this package. Approve the plugin install once it shows the exact package/version and source.
3. After DSH reports it applied the change (or after its requested restart), a **Desktop Center** entry should appear in the DSH sidebar. Open it and click **重新扫描**.
4. Check the eight Desktop cards, Skills inventory, cross-app comparison and diagnostics. Verify Qoder CN and International roots are separated. Apps with unknown paths should be marked as unverified instead of silently counted as empty.

For a packaged `.tgz`, quit DSH Desktop and run `dsh plugin --profile desktop add "/absolute/path/to/package.tgz" --ignore-scripts`, then reopen Desktop.

## Safety and scope

Scanning is read-only. After target selection and confirmation, the owner can install and recoverably uninstall local Skills or add and remove user MCP entries for the two Qoder editions. Application discovery reports installed bundles and known configuration paths. Requests use DSH's authenticated Connection Fetch bridge. Fatal scanning errors are redacted.

## Known validation limits

The Qoder applications are the validated write targets. Other applications offer discovery and supported read-only inventories. Doubao currently offers application discovery. Consult the [installation and acceptance guide](https://github.com/LemonTeaViTA/dsh-desktop-center/blob/main/docs/INSTALLATION_V0.3.md) for exact version coverage and rollback steps.

## Development

The copied `lib/registry` and `lib/skills` modules are generated from the two independent packages via `npm run pack:desktop-center`. They must not diverge. In the project root: `npm run check && npm test && npm run typecheck`.
