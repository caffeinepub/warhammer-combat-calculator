// Chance to kill calculation using binomial distribution

import type { DefenderModel, CombatResult } from '../models/combat';

export function calculateChanceToKill(
  defender: DefenderModel,
  combatResult: CombatResult,
  killThreshold: number = 1 // How many models to kill
): number {
  const totalDamage = combatResult.damageByDefender.get(defender.id) || 0;
  const woundsPerModel = defender.wounds;
  
  // Simple approximation: use normal distribution for large samples
  // For exact calculation, would need full binomial distribution
  
  // Expected models killed
  const expectedKills = totalDamage / woundsPerModel;
  
  // Variance approximation (simplified)
  const variance = expectedKills * 0.5; // Rough estimate
  const stdDev = Math.sqrt(variance);
  
  if (stdDev === 0) {
    return expectedKills >= killThreshold ? 1 : 0;
  }
  
  // Z-score
  const z = (killThreshold - 0.5 - expectedKills) / stdDev;
  
  // Approximate cumulative probability
  const probability = 1 - normalCDF(z);
  
  return Math.max(0, Math.min(1, probability));
}

function normalCDF(z: number): number {
  // Approximation of standard normal CDF
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  
  return z > 0 ? 1 - p : p;
}
