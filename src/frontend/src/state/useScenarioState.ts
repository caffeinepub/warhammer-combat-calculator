import { useState, useCallback } from 'react';
import type { CombatScenario, AttackerUnit, DefenderModel, Weapon, PriorityMode } from '../models/combat';

export function useScenarioState() {
  const [scenario, setScenario] = useState<CombatScenario>({
    attackers: [],
    defenders: [],
    priority: 'focus_fire'
  });
  
  const addAttacker = useCallback((attacker: AttackerUnit) => {
    setScenario(prev => ({
      ...prev,
      attackers: [...prev.attackers, attacker]
    }));
  }, []);
  
  const removeAttacker = useCallback((id: string) => {
    setScenario(prev => ({
      ...prev,
      attackers: prev.attackers.filter(a => a.id !== id)
    }));
  }, []);
  
  const updateAttacker = useCallback((id: string, updates: Partial<AttackerUnit>) => {
    setScenario(prev => ({
      ...prev,
      attackers: prev.attackers.map(a => a.id === id ? { ...a, ...updates } : a)
    }));
  }, []);
  
  const addWeaponToAttacker = useCallback((attackerId: string, weapon: Weapon) => {
    setScenario(prev => ({
      ...prev,
      attackers: prev.attackers.map(a => 
        a.id === attackerId 
          ? { ...a, weapons: [...a.weapons, weapon] }
          : a
      )
    }));
  }, []);
  
  const removeWeaponFromAttacker = useCallback((attackerId: string, weaponId: string) => {
    setScenario(prev => ({
      ...prev,
      attackers: prev.attackers.map(a =>
        a.id === attackerId
          ? { ...a, weapons: a.weapons.filter(w => w.id !== weaponId) }
          : a
      )
    }));
  }, []);
  
  const updateWeapon = useCallback((attackerId: string, weaponId: string, updates: Partial<Weapon>) => {
    setScenario(prev => ({
      ...prev,
      attackers: prev.attackers.map(a =>
        a.id === attackerId
          ? {
              ...a,
              weapons: a.weapons.map(w => w.id === weaponId ? { ...w, ...updates } : w)
            }
          : a
      )
    }));
  }, []);
  
  const addDefender = useCallback((defender: DefenderModel) => {
    setScenario(prev => ({
      ...prev,
      defenders: [...prev.defenders, defender]
    }));
  }, []);
  
  const removeDefender = useCallback((id: string) => {
    setScenario(prev => ({
      ...prev,
      defenders: prev.defenders.filter(d => d.id !== id)
    }));
  }, []);
  
  const updateDefender = useCallback((id: string, updates: Partial<DefenderModel>) => {
    setScenario(prev => ({
      ...prev,
      defenders: prev.defenders.map(d => d.id === id ? { ...d, ...updates } : d)
    }));
  }, []);
  
  const setPriority = useCallback((priority: PriorityMode) => {
    setScenario(prev => ({ ...prev, priority }));
  }, []);
  
  const clearScenario = useCallback(() => {
    setScenario({
      attackers: [],
      defenders: [],
      priority: 'focus_fire'
    });
  }, []);
  
  const replaceScenario = useCallback((newScenario: CombatScenario) => {
    setScenario({
      attackers: newScenario.attackers,
      defenders: newScenario.defenders,
      priority: newScenario.priority || 'focus_fire'
    });
  }, []);
  
  return {
    scenario,
    addAttacker,
    removeAttacker,
    updateAttacker,
    addWeaponToAttacker,
    removeWeaponFromAttacker,
    updateWeapon,
    addDefender,
    removeDefender,
    updateDefender,
    setPriority,
    clearScenario,
    replaceScenario
  };
}
