# Specification

## Summary
**Goal:** Add a defender-side damage modification step (flat reduction and/or half damage) that applies after failed saves (including invulnerable) and before Feel No Pain, across scenario data, UI, and both deterministic and simulation calculators.

**Planned changes:**
- Extend `DefenderModel` to include two optional defender damage modification fields: a flat per-unsaved-wound damage modifier and a half-damage toggle; ensure these fields round-trip in scenario serialization/deserialization and remain backward-compatible with older saved scenarios.
- Update the Scenario Builder `DefenderEditor` UI to let users set a numeric flat damage modifier (including negative values such as -1) and a “Half damage” toggle, with helper text clarifying timing (after saves, before Feel No Pain).
- Update deterministic expected-damage calculations to apply defender damage modification strictly between save resolution and Feel No Pain, in order: flat modifier (min 1), then halve (min 1), then Feel No Pain.
- Update Monte Carlo simulation to apply the same damage modification timing and order per unsaved wound: roll damage, apply flat modifier (min 1), apply halve (min 1), then Feel No Pain.

**User-visible outcome:** Users can configure defender damage reduction (flat reduction and/or half damage) in the scenario builder, and both deterministic and simulated results update to reflect this step after saves and before Feel No Pain.
