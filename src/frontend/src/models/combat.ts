// Core TypeScript models for Warhammer Combat Calculator

export interface SpecialRules {
  rerollHits?: 'all' | 'ones' | 'failed';
  rerollWounds?: 'all' | 'ones' | 'failed';
  lethalHits?: boolean;
  devastatingWounds?: boolean;
  sustainedHits?: number; // extra hits on 6s
}

export interface Weapon {
  id: string;
  name: string;
  attacks: number | string; // number or dice notation like "D6", "2D3"
  toHit: number; // 2-6 (the number needed on d6)
  strength: number;
  armorPenetration: number; // 0, -1, -2, etc.
  damage: number | string; // 1, 2, "D3", "D6", etc.
  special_rules?: SpecialRules;
}

export interface AttackerUnit {
  id: string;
  name: string;
  modelCount: number;
  weapons: Weapon[];
  isCharging?: boolean;
}

export interface DefenderSpecialRules {
  cover?: boolean;
  stickyObjectives?: boolean;
}

export interface DefenderModel {
  id: string;
  name: string;
  modelCount: number;
  toughness: number;
  save: number; // 2-6
  invulnSave?: number; // 4, 5, 6, etc.
  feelNoPain?: number; // 5, 6, etc.
  wounds: number;
  special_rules?: DefenderSpecialRules;
}

export type PriorityMode = 'focus_fire' | 'spread' | 'weakest_first';

export interface CombatScenario {
  attackers: AttackerUnit[];
  defenders: DefenderModel[];
  priority?: PriorityMode;
}

export interface AttackBreakdown {
  attackerName: string;
  weaponName: string;
  defenderName: string;
  attacks: number;
  expectedHits: number;
  expectedWounds: number;
  expectedDamage: number;
}

export interface ExpectedKills {
  defenderId: string;
  defenderName: string;
  modelsKilled: number;
  overkill: number;
}

export interface CombatResult {
  totalExpectedDamage: number;
  damageByAttacker: Map<string, number>;
  damageByDefender: Map<string, number>;
  expectedKills: ExpectedKills[];
  breakdown: AttackBreakdown[];
}

export interface SimulationResult {
  mean: number;
  median: number;
  percentile95: number;
  histogram: { bin: number; count: number }[];
  samples: number[];
}
