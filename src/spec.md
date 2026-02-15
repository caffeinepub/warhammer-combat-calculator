# Specification

## Summary
**Goal:** Remove built-in quick presets and add Internet Identity–backed login with persistent, user-owned saved scenario templates and last-session restore.

**Planned changes:**
- Remove the “Quick Presets” UI from the Scenario Builder sidebar and eliminate any remaining preset-related UI text and imports/usage.
- Add always-visible Internet Identity authentication controls (log in/log out) and a clear signed-in indicator (e.g., truncated principal).
- Implement authenticated backend CRUD for user-owned, named scenario templates storing the full scenario (attackers, defenders, priority), isolated per principal and persisted via stable storage across upgrades.
- Replace presets with a “Saved Templates” sidebar panel that (when logged in) can save the current scenario, list templates, load a template into the Scenario Builder, and delete templates; when logged out, indicate login is required and disable actions.
- Persist each authenticated user’s most recent in-progress scenario in the backend and automatically restore it on app load; do not write shared state for anonymous users.

**User-visible outcome:** Users can log in with Internet Identity, save and manage their own attacker/defender scenario templates, and have their last in-progress scenario automatically restored across sessions; quick presets are no longer available.
