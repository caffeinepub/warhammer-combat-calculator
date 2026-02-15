// Monte Carlo simulation for combat scenarios

import { rollDice } from './dice';
import { calculateWoundRoll } from './probability';
import type { CombatScenario, SimulationResult, Weapon, AttackerUnit, DefenderModel } from '../models/combat';

function simulateSingleCombat(scenario: CombatScenario): number {
  let totalDamage = 0;
  
  for (const attacker of scenario.attackers) {
    for (const weapon of attacker.weapons) {
      for (const defender of scenario.defenders) {
        const damage = simulateWeaponVsDefender(weapon, attacker, defender);
        totalDamage += damage;
      }
    }
  }
  
  return totalDamage;
}

function simulateWeaponVsDefender(
  weapon: Weapon,
  attacker: AttackerUnit,
  defender: DefenderModel
): number {
  const attacks = rollDice(weapon.attacks) * attacker.modelCount;
  let hits = 0;
  
  // Phase 1: Hit rolls
  for (let i = 0; i < attacks; i++) {
    let hitRoll = Math.floor(Math.random() * 6) + 1;
    
    if (hitRoll >= weapon.toHit) {
      hits++;
      
      // Sustained Hits
      if (weapon.special_rules?.sustainedHits && hitRoll === 6) {
        hits += weapon.special_rules.sustainedHits;
      }
    } else if (weapon.special_rules?.rerollHits) {
      // Reroll logic
      if (weapon.special_rules.rerollHits === 'all' || 
          (weapon.special_rules.rerollHits === 'ones' && hitRoll === 1)) {
        hitRoll = Math.floor(Math.random() * 6) + 1;
        if (hitRoll >= weapon.toHit) {
          hits++;
        }
      }
    }
  }
  
  // Phase 2: Wound rolls
  const woundTarget = calculateWoundRoll(weapon.strength, defender.toughness);
  let wounds = 0;
  
  for (let i = 0; i < hits; i++) {
    let woundRoll = Math.floor(Math.random() * 6) + 1;
    
    // Lethal Hits: auto-wound on 6s to hit (simplified: treat as auto-wound)
    if (weapon.special_rules?.lethalHits && woundRoll === 6) {
      wounds++;
    } else if (woundRoll >= woundTarget) {
      wounds++;
    } else if (weapon.special_rules?.rerollWounds) {
      if (weapon.special_rules.rerollWounds === 'all' ||
          (weapon.special_rules.rerollWounds === 'ones' && woundRoll === 1)) {
        woundRoll = Math.floor(Math.random() * 6) + 1;
        if (woundRoll >= woundTarget) {
          wounds++;
        }
      }
    }
  }
  
  // Phase 3: Save rolls
  let modifiedSave = defender.save + weapon.armorPenetration;
  if (defender.special_rules?.cover) modifiedSave -= 1;
  if (defender.invulnSave && defender.invulnSave < modifiedSave) {
    modifiedSave = defender.invulnSave;
  }
  modifiedSave = Math.max(2, modifiedSave);
  
  let unsavedWounds = 0;
  for (let i = 0; i < wounds; i++) {
    if (modifiedSave > 6) {
      unsavedWounds++;
    } else {
      const saveRoll = Math.floor(Math.random() * 6) + 1;
      if (saveRoll < modifiedSave) {
        unsavedWounds++;
      }
    }
  }
  
  // Phase 4: Damage
  let totalDamage = 0;
  for (let i = 0; i < unsavedWounds; i++) {
    totalDamage += rollDice(weapon.damage);
  }
  
  // Phase 5: Feel No Pain
  if (defender.feelNoPain) {
    let finalDamage = 0;
    for (let i = 0; i < totalDamage; i++) {
      const fnpRoll = Math.floor(Math.random() * 6) + 1;
      if (fnpRoll < defender.feelNoPain) {
        finalDamage++;
      }
    }
    return finalDamage;
  }
  
  return totalDamage;
}

export function runSimulation(
  scenario: CombatScenario,
  iterations: number = 10000
): SimulationResult {
  const samples: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const damage = simulateSingleCombat(scenario);
    samples.push(damage);
  }
  
  // Sort for percentile calculations
  const sorted = [...samples].sort((a, b) => a - b);
  
  const mean = samples.reduce((sum, val) => sum + val, 0) / samples.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const percentile95 = sorted[Math.floor(sorted.length * 0.95)];
  
  // Generate histogram
  const histogram = generateHistogram(samples);
  
  return {
    mean,
    median,
    percentile95,
    histogram,
    samples
  };
}

function generateHistogram(samples: number[]): { bin: number; count: number }[] {
  if (samples.length === 0) return [];
  
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const binCount = Math.min(30, Math.ceil(Math.sqrt(samples.length)));
  const binSize = Math.max(1, Math.ceil((max - min) / binCount));
  
  const bins: Map<number, number> = new Map();
  
  for (const sample of samples) {
    const bin = Math.floor(sample / binSize) * binSize;
    bins.set(bin, (bins.get(bin) || 0) + 1);
  }
  
  return Array.from(bins.entries())
    .map(([bin, count]) => ({ bin, count }))
    .sort((a, b) => a.bin - b.bin);
}
