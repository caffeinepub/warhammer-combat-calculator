import type { CombatScenario, AttackerUnit, DefenderModel } from '../models/combat';
import type { Scenario } from '../backend';

export function serializeScenario(scenario: CombatScenario): Scenario {
  return {
    attackers: scenario.attackers.map(a => JSON.stringify(a)),
    defenders: scenario.defenders.map(d => JSON.stringify(d)),
    priority: scenario.priority || 'focus_fire',
  };
}

export function deserializeScenario(scenario: Scenario): CombatScenario {
  return {
    attackers: scenario.attackers.map(a => JSON.parse(a) as AttackerUnit),
    defenders: scenario.defenders.map(d => JSON.parse(d) as DefenderModel),
    priority: scenario.priority as 'focus_fire' | 'spread' | 'weakest_first',
  };
}
