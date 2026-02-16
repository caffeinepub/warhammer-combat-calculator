import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import type { DefenderModel } from '../../models/combat';

interface DefenderEditorProps {
  defender: DefenderModel;
  onUpdate: (updates: Partial<DefenderModel>) => void;
  onRemove: () => void;
}

export function DefenderEditor({ defender, onUpdate, onRemove }: DefenderEditorProps) {
  return (
    <Card className="border-2 border-destructive/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {defender.name || 'Defender Unit'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor={`defender-name-${defender.id}`}>Unit Name</Label>
          <Input
            id={`defender-name-${defender.id}`}
            value={defender.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Enter unit name"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`defender-models-${defender.id}`}>Model Count</Label>
            <span className="text-sm font-medium">{defender.modelCount}</span>
          </div>
          <Slider
            id={`defender-models-${defender.id}`}
            value={[defender.modelCount]}
            onValueChange={([value]) => onUpdate({ modelCount: value })}
            min={1}
            max={30}
            step={1}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor={`defender-toughness-${defender.id}`}>Toughness</Label>
            <Input
              id={`defender-toughness-${defender.id}`}
              type="number"
              value={defender.toughness}
              onChange={(e) => onUpdate({ toughness: parseInt(e.target.value) || 1 })}
              min="1"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor={`defender-save-${defender.id}`}>Save</Label>
            <Select
              value={defender.save.toString()}
              onValueChange={(v) => onUpdate({ save: parseInt(v) })}
            >
              <SelectTrigger id={`defender-save-${defender.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
                <SelectItem value="6">6+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor={`defender-wounds-${defender.id}`}>Wounds</Label>
            <Input
              id={`defender-wounds-${defender.id}`}
              type="number"
              value={defender.wounds}
              onChange={(e) => onUpdate({ wounds: parseInt(e.target.value) || 1 })}
              min="1"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor={`defender-invuln-${defender.id}`}>Invuln Save</Label>
            <Select
              value={defender.invulnSave?.toString() || 'none'}
              onValueChange={(v) => onUpdate({ invulnSave: v === 'none' ? undefined : parseInt(v) })}
            >
              <SelectTrigger id={`defender-invuln-${defender.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="3">3++</SelectItem>
                <SelectItem value="4">4++</SelectItem>
                <SelectItem value="5">5++</SelectItem>
                <SelectItem value="6">6++</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between">
            <Label htmlFor={`defender-fnp-${defender.id}`}>Feel No Pain</Label>
            <Select
              value={defender.feelNoPain?.toString() || 'none'}
              onValueChange={(v) => onUpdate({ feelNoPain: v === 'none' ? undefined : parseInt(v) })}
            >
              <SelectTrigger id={`defender-fnp-${defender.id}`} className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
                <SelectItem value="6">6+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor={`defender-cover-${defender.id}`}>In Cover</Label>
            <Switch
              id={`defender-cover-${defender.id}`}
              checked={defender.special_rules?.cover || false}
              onCheckedChange={(checked) => onUpdate({ 
                special_rules: { ...defender.special_rules, cover: checked } 
              })}
            />
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-border/50">
          <div className="space-y-1">
            <Label htmlFor={`defender-damage-reduction-${defender.id}`} className="text-sm font-medium">
              Damage Reduction
            </Label>
            <Input
              id={`defender-damage-reduction-${defender.id}`}
              type="number"
              value={defender.damageReduction ?? ''}
              onChange={(e) => {
                const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                onUpdate({ damageReduction: value });
              }}
              placeholder="e.g., -1"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Flat modifier per unsaved wound (e.g., -1). Applied after saves, before Feel No Pain.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor={`defender-damage-halve-${defender.id}`} className="text-sm font-medium">
                Half Damage
              </Label>
              <p className="text-xs text-muted-foreground">
                Halve damage after saves, before Feel No Pain
              </p>
            </div>
            <Switch
              id={`defender-damage-halve-${defender.id}`}
              checked={defender.damageHalve || false}
              onCheckedChange={(checked) => onUpdate({ damageHalve: checked })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
