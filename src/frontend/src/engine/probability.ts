// Probability calculation helpers for d6 rolls

export function calculateD6Probability(target: number, rerolls?: 'all' | 'ones' | 'failed'): number {
  // Target is the number needed on d6 (2-6)
  // Probability of rolling >= target on d6
  const baseProb = (7 - target) / 6;
  
  if (!rerolls) return baseProb;
  
  if (rerolls === 'all') {
    // Reroll all failures
    return baseProb + ((1 - baseProb) * baseProb);
  }
  
  if (rerolls === 'ones') {
    // Reroll only 1s
    // Probability of rolling 1 is 1/6
    // If we roll 1, we get another chance at baseProb
    return baseProb + (1/6 * baseProb);
  }
  
  if (rerolls === 'failed') {
    // Same as 'all' - reroll all failures
    return baseProb + ((1 - baseProb) * baseProb);
  }
  
  return baseProb;
}

export function calculateHitProbability(toHit: number, rerolls?: 'all' | 'ones' | 'failed'): number {
  return calculateD6Probability(toHit, rerolls);
}

export function calculateWoundRoll(strength: number, toughness: number): number {
  if (strength >= toughness * 2) return 2;
  if (strength > toughness) return 3;
  if (strength === toughness) return 4;
  if (strength < toughness && strength * 2 > toughness) return 5;
  return 6;
}

export function calculateWoundProbability(
  strength: number,
  toughness: number,
  rerolls?: 'all' | 'ones' | 'failed'
): number {
  const woundRoll = calculateWoundRoll(strength, toughness);
  return calculateD6Probability(woundRoll, rerolls);
}

export function calculateFailedSaveProbability(
  save: number,
  ap: number,
  invuln?: number,
  cover?: boolean
): number {
  let modifiedSave = save + ap;
  
  // Cover gives +1 to save
  if (cover) modifiedSave -= 1;
  
  // Use invuln if better (lower number is better)
  if (invuln && invuln < modifiedSave) {
    modifiedSave = invuln;
  }
  
  // Can't save better than 2+
  modifiedSave = Math.max(2, modifiedSave);
  
  // If save would be 7+, automatically fail
  if (modifiedSave > 6) return 1.0;
  
  // Probability of FAILING the save
  return (modifiedSave - 1) / 6;
}
