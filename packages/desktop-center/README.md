# DSH Desktop Center V0.3 — single-install Bundle (preview)

One DSH Bundle package containing a **real Web/Desktop sidebar panel** and separately versioned, read-only services:

- `desktopRegistry` — detects app/config candidates for seven AI Desktop targets, not CLI processes.
- `skillsHub` — lists Skills, hashes whole packages, and compares differences.
- `desktopCenter` — aggregate read-only view and authenticated Connection Fetch routes.

Supported target version (declared, not yet machine-tested): **DSH `>=0.2.1-rc.2 <0.3.0-0`**, Node >=22, macOS scanning. Other OS hosts display unsupported status.

## Install in DSH Desktop

1. Back up the current DSH profile and disable/uninstall the earlier **V0.2** two bundles, if present, to avoid duplicate provider names. Don't edit profile files manually.
2. In DSH **Plugins → Add plugin**, select a local package path and point to this folder if the current DSH build accepts local directories. Alternatively use Creator mode and tell DSH to call official `plugin_manager` with `action: install_bundle` and `target` set to the **absolute folder path** for this package. Approve the plugin install once it shows the exact package/version and source.
3. After DSH reports it applied the change (or after its requested restart), a **Desktop Center** entry should appear in the DSH sidebar. Open it and click **重新扫描**.
4. Check the seven Desktop cards, Skills inventory, cross-app comparison and diagnostics. Verify Qoder CN and International roots are separated. Apps with unknown paths should be marked as unverified instead of silently counted as empty.

For a packaged `.tgz`, supply its absolute path or local `file:` spec if the current Plugin Manager supports tarballs. The folder method is preferable for the very first Mac compatibility test. `npm pack` creates the `.tgz`; it is **not** a double-clickable macOS `.dmg`.

## Safety and scope

No login, CDP, AppleScript, remote Desktop control, plugin installation, credential reads or writes to other Desktop apps. All application paths are candidates, not evidence of login/running process. The API is GET-only, uses DSH's authenticated Connection Fetch bridge and returns no cache headers. All fatal scanning errors are redacted.

## Known validation limits

This bundle's manifest, factory registration and Host API are exercised with local stubs and Node test fixtures. This is **not proof of successful integration into the user's macOS DSH build**. Re-run the above acceptance steps in the target build before declaring it production-ready. Compatibility and UI injection can change across DSH prereleases.

## Development

The copied `lib/registry` and `lib/skills` modules are generated from the two independent packages via `npm run pack:desktop-center`. They must not diverge. In the project root: `npm run check && npm test && npm run typecheck`.
