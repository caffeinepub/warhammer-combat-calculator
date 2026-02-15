// Multi-attacker, multi-defender combat resolution

import { calculateExpectedDamage, calculateExpectedHits } from './deterministicExpectedDamage';
import { sortDefendersByPriority } from './priority';
import { parseAttacks } from './dice';
import type { CombatScenario, CombatResult, AttackBreakdown, ExpectedKills } from '../models/combat';

export function resolveScenario(scenario: CombatScenario): CombatResult {
  const result: CombatResult = {
    totalExpectedDamage: 0,
    damageByAttacker: new Map(),
    damageByDefender: new Map(),
    expectedKills: [],
    breakdown: []
  };
  
  // Sort defenders by priority
  const sortedDefenders = sortDefendersByPriority(scenario.defenders, scenario.priority);
  
  // For each attacker unit
  for (const attacker of scenario.attackers) {
    // For each weapon they have
    for (const weapon of attacker.weapons) {
      // Against each defender type
      for (const defender of sortedDefenders) {
        const damage = calculateExpectedDamage(weapon, attacker, defender);
        const avgAttacks = parseAttacks(weapon.attacks);
        const totalAttacks = avgAttacks * attacker.modelCount;
        const expectedHits = calculateExpectedHits(weapon, attacker);
        
        // Track damage
        result.totalExpectedDamage += damage;
        
        const attackerDamage = result.damageByAttacker.get(attacker.id) || 0;
        result.damageByAttacker.set(attacker.id, attackerDamage + damage);
        
        const defenderDamage = result.damageByDefender.get(defender.id) || 0;
        result.damageByDefender.set(defender.id, defenderDamage + damage);
        
        // Detailed breakdown
        result.breakdown.push({
          attackerName: `${attacker.name} (${attacker.modelCount}x)`,
          weaponName: weapon.name,
          defenderName: `${defender.name} (${defender.modelCount}x)`,
          attacks: totalAttacks,
          expectedHits: expectedHits,
          expectedWounds: damage,
          expectedDamage: damage
        });
      }
    }
  }
  
  // Calculate expected kills per defender
  for (const defender of sortedDefenders) {
    const totalDamageToDefender = result.damageByDefender.get(defender.id) || 0;
    const modelsKilled = Math.min(
      Math.floor(totalDamageToDefender / defender.wounds),
      defender.modelCount
    );
    const overkill = totalDamageToDefender % defender.wounds;
    
    result.expectedKills.push({
      defenderId: defender.id,
      defenderName: defender.name,
      modelsKilled,
      overkill
    });
  }
  
  return result;
}
