// Export results to JSON and CSV

import type { CombatScenario, CombatResult } from '../models/combat';

export function exportToJSON(scenario: CombatScenario, result: CombatResult): void {
  const data = {
    scenario: {
      attackers: scenario.attackers,
      defenders: scenario.defenders,
      priority: scenario.priority
    },
    results: {
      totalExpectedDamage: result.totalExpectedDamage,
      expectedKills: result.expectedKills,
      breakdown: result.breakdown
    },
    exportedAt: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `warhammer-combat-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToCSV(result: CombatResult): void {
  const headers = ['Attacker', 'Weapon', 'Defender', 'Attacks', 'Expected Hits', 'Expected Wounds', 'Expected Damage'];
  const rows = result.breakdown.map(b => [
    b.attackerName,
    b.weaponName,
    b.defenderName,
    b.attacks.toFixed(2),
    b.expectedHits.toFixed(2),
    b.expectedWounds.toFixed(2),
    b.expectedDamage.toFixed(2)
  ]);
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `warhammer-combat-breakdown-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
