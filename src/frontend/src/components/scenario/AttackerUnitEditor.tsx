import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2 } from 'lucide-react';
import { WeaponEditor } from './WeaponEditor';
import type { AttackerUnit, Weapon } from '../../models/combat';

interface AttackerUnitEditorProps {
  attacker: AttackerUnit;
  onUpdate: (updates: Partial<AttackerUnit>) => void;
  onRemove: () => void;
  onAddWeapon: (weapon: Weapon) => void;
  onRemoveWeapon: (weaponId: string) => void;
  onUpdateWeapon: (weaponId: string, updates: Partial<Weapon>) => void;
}

export function AttackerUnitEditor({
  attacker,
  onUpdate,
  onRemove,
  onAddWeapon,
  onRemoveWeapon,
  onUpdateWeapon
}: AttackerUnitEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const handleAddWeapon = () => {
    const newWeapon: Weapon = {
      id: `weapon-${Date.now()}-${Math.random()}`,
      name: 'New Weapon',
      attacks: 1,
      toHit: 3,
      strength: 4,
      armorPenetration: 0,
      damage: 1
    };
    onAddWeapon(newWeapon);
  };
  
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {attacker.name || 'Attacker Unit'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor={`attacker-name-${attacker.id}`}>Unit Name</Label>
            <Input
              id={`attacker-name-${attacker.id}`}
              value={attacker.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Enter unit name"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`attacker-models-${attacker.id}`}>Model Count</Label>
              <span className="text-sm font-medium">{attacker.modelCount}</span>
            </div>
            <Slider
              id={`attacker-models-${attacker.id}`}
              value={[attacker.modelCount]}
              onValueChange={([value]) => onUpdate({ modelCount: value })}
              min={1}
              max={20}
              step={1}
            />
          </div>
        </div>
        
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Weapons</h4>
            <Button variant="outline" size="sm" onClick={handleAddWeapon}>
              <Plus className="h-3 w-3 mr-1" />
              Add Weapon
            </Button>
          </div>
          
          {attacker.weapons.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No weapons added yet
            </p>
          ) : (
            <div className="space-y-2">
              {attacker.weapons.map((weapon) => (
                <WeaponEditor
                  key={weapon.id}
                  weapon={weapon}
                  onUpdate={(updates) => onUpdateWeapon(weapon.id, updates)}
                  onRemove={() => onRemoveWeapon(weapon.id)}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
