// Deterministic expected damage calculation engine

import { parseAttacks, calculateAverageDamage } from './dice';
import {
  calculateHitProbability,
  calculateWoundProbability,
  calculateFailedSaveProbability
} from './probability';
import type { Weapon, AttackerUnit, DefenderModel } from '../models/combat';

export function calculateExpectedDamage(
  weapon: Weapon,
  attacker: AttackerUnit,
  defender: DefenderModel
): number {
  const avgAttacks = parseAttacks(weapon.attacks);
  const totalAttacks = avgAttacks * attacker.modelCount;
  
  // Phase 1: Hit
  let hitProb = calculateHitProbability(weapon.toHit, weapon.special_rules?.rerollHits);
  let expectedHits = totalAttacks * hitProb;
  
  // Sustained Hits: extra hits on 6s
  if (weapon.special_rules?.sustainedHits && weapon.special_rules.sustainedHits > 0) {
    const critProb = 1/6; // Rolling a 6
    const extraHits = totalAttacks * critProb * weapon.special_rules.sustainedHits;
    expectedHits += extraHits;
  }
  
  // Phase 2: Wound
  let woundProb = calculateWoundProbability(
    weapon.strength,
    defender.toughness,
    weapon.special_rules?.rerollWounds
  );
  
  // Lethal Hits: critical hits (6s to hit) auto-wound
  let expectedWounds = expectedHits * woundProb;
  if (weapon.special_rules?.lethalHits) {
    const critHitProb = 1/6;
    const critHits = totalAttacks * critHitProb;
    const nonCritHits = expectedHits - critHits;
    // Crit hits auto-wound, non-crit hits wound normally
    expectedWounds = critHits + (nonCritHits * woundProb);
  }
  
  // Phase 3: Save
  const failSaveProb = calculateFailedSaveProbability(
    defender.save,
    weapon.armorPenetration,
    defender.invulnSave,
    defender.special_rules?.cover
  );
  
  let expectedUnsavedWounds = expectedWounds * failSaveProb;
  
  // Devastating Wounds: critical wounds (6s to wound) bypass saves
  if (weapon.special_rules?.devastatingWounds) {
    const critWoundProb = 1/6;
    const critWounds = expectedHits * critWoundProb;
    const nonCritWounds = expectedWounds - critWounds;
    // Crit wounds bypass saves, non-crit wounds use normal save
    expectedUnsavedWounds = critWounds + (nonCritWounds * failSaveProb);
  }
  
  // Phase 4: Damage (base weapon damage)
  let avgDamage = calculateAverageDamage(weapon.damage);
  
  // Phase 4a: Apply defender damage modification (after saves, before FNP)
  // First apply flat reduction
  if (defender.damageReduction !== undefined) {
    avgDamage = Math.max(1, avgDamage + defender.damageReduction);
  }
  
  // Then apply half damage
  if (defender.damageHalve) {
    avgDamage = Math.max(1, avgDamage / 2);
  }
  
  let expectedDamageTotal = expectedUnsavedWounds * avgDamage;
  
  // Phase 5: Feel No Pain
  if (defender.feelNoPain) {
    const fnpProb = (7 - defender.feelNoPain) / 6;
    expectedDamageTotal *= (1 - fnpProb);
  }
  
  return expectedDamageTotal;
}

export function calculateExpectedHits(
  weapon: Weapon,
  attacker: AttackerUnit
): number {
  const avgAttacks = parseAttacks(weapon.attacks);
  const totalAttacks = avgAttacks * attacker.modelCount;
  const hitProb = calculateHitProbability(weapon.toHit, weapon.special_rules?.rerollHits);
  let expectedHits = totalAttacks * hitProb;
  
  if (weapon.special_rules?.sustainedHits && weapon.special_rules.sustainedHits > 0) {
    const critProb = 1/6;
    const extraHits = totalAttacks * critProb * weapon.special_rules.sustainedHits;
    expectedHits += extraHits;
  }
  
  return expectedHits;
}
