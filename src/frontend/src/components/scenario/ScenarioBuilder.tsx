import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { AttackerUnitEditor } from './AttackerUnitEditor';
import { DefenderEditor } from './DefenderEditor';
import { SavedTemplatesPanel } from './SavedTemplatesPanel';
import { PrioritySelector } from './PrioritySelector';
import type { AttackerUnit, DefenderModel, Weapon, PriorityMode, CombatScenario } from '../../models/combat';

interface ScenarioBuilderProps {
  scenario: CombatScenario;
  attackers: AttackerUnit[];
  defenders: DefenderModel[];
  priority: PriorityMode;
  onAddAttacker: (attacker: AttackerUnit) => void;
  onRemoveAttacker: (id: string) => void;
  onUpdateAttacker: (id: string, updates: Partial<AttackerUnit>) => void;
  onAddWeapon: (attackerId: string, weapon: Weapon) => void;
  onRemoveWeapon: (attackerId: string, weaponId: string) => void;
  onUpdateWeapon: (attackerId: string, weaponId: string, updates: Partial<Weapon>) => void;
  onAddDefender: (defender: DefenderModel) => void;
  onRemoveDefender: (id: string) => void;
  onUpdateDefender: (id: string, updates: Partial<DefenderModel>) => void;
  onSetPriority: (priority: PriorityMode) => void;
  onReplaceScenario: (scenario: CombatScenario) => void;
}

export function ScenarioBuilder({
  scenario,
  attackers,
  defenders,
  priority,
  onAddAttacker,
  onRemoveAttacker,
  onUpdateAttacker,
  onAddWeapon,
  onRemoveWeapon,
  onUpdateWeapon,
  onAddDefender,
  onRemoveDefender,
  onUpdateDefender,
  onSetPriority,
  onReplaceScenario
}: ScenarioBuilderProps) {
  const handleAddAttacker = () => {
    const newAttacker: AttackerUnit = {
      id: `attacker-${Date.now()}-${Math.random()}`,
      name: 'New Attacker',
      modelCount: 5,
      weapons: []
    };
    onAddAttacker(newAttacker);
  };
  
  const handleAddDefender = () => {
    const newDefender: DefenderModel = {
      id: `defender-${Date.now()}-${Math.random()}`,
      name: 'New Defender',
      modelCount: 10,
      toughness: 4,
      save: 4,
      wounds: 1
    };
    onAddDefender(newDefender);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Attackers Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Attacking Units</CardTitle>
              <Button onClick={handleAddAttacker}>
                <Plus className="h-4 w-4 mr-2" />
                Add Attacker
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {attackers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No attacking units added yet.</p>
                  <p className="text-sm mt-2">Click "Add Attacker" to begin building your scenario.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {attackers.map((attacker) => (
                    <AttackerUnitEditor
                      key={attacker.id}
                      attacker={attacker}
                      onUpdate={(updates) => onUpdateAttacker(attacker.id, updates)}
                      onRemove={() => onRemoveAttacker(attacker.id)}
                      onAddWeapon={(weapon) => onAddWeapon(attacker.id, weapon)}
                      onRemoveWeapon={(weaponId) => onRemoveWeapon(attacker.id, weaponId)}
                      onUpdateWeapon={(weaponId, updates) => onUpdateWeapon(attacker.id, weaponId, updates)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* Defenders Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Defending Units</CardTitle>
              <Button onClick={handleAddDefender} variant="destructive">
                <Plus className="h-4 w-4 mr-2" />
                Add Defender
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {defenders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No defending units added yet.</p>
                  <p className="text-sm mt-2">Click "Add Defender" to begin building your scenario.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {defenders.map((defender) => (
                    <DefenderEditor
                      key={defender.id}
                      defender={defender}
                      onUpdate={(updates) => onUpdateDefender(defender.id, updates)}
                      onRemove={() => onRemoveDefender(defender.id)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      
      {/* Sidebar */}
      <div className="space-y-4">
        <PrioritySelector priority={priority} onChange={onSetPriority} />
        <SavedTemplatesPanel 
          currentScenario={scenario}
          onLoadScenario={onReplaceScenario}
        />
      </div>
    </div>
  );
}
