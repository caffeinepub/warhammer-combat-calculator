import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trash2, HelpCircle } from 'lucide-react';
import type { Weapon } from '../../models/combat';

interface WeaponEditorProps {
  weapon: Weapon;
  onUpdate: (updates: Partial<Weapon>) => void;
  onRemove: () => void;
}

export function WeaponEditor({ weapon, onUpdate, onRemove }: WeaponEditorProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{weapon.name || 'Weapon'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor={`weapon-name-${weapon.id}`}>Name</Label>
            <Input
              id={`weapon-name-${weapon.id}`}
              value={weapon.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Weapon name"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor={`weapon-attacks-${weapon.id}`}>Attacks</Label>
            <Input
              id={`weapon-attacks-${weapon.id}`}
              value={weapon.attacks}
              onChange={(e) => onUpdate({ attacks: e.target.value })}
              placeholder="e.g., 2, D6, 2D3"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor={`weapon-tohit-${weapon.id}`}>To Hit</Label>
            <Select
              value={weapon.toHit.toString()}
              onValueChange={(v) => onUpdate({ toHit: parseInt(v) })}
            >
              <SelectTrigger id={`weapon-tohit-${weapon.id}`}>
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
            <Label htmlFor={`weapon-strength-${weapon.id}`}>Strength</Label>
            <Input
              id={`weapon-strength-${weapon.id}`}
              type="number"
              value={weapon.strength}
              onChange={(e) => onUpdate({ strength: parseInt(e.target.value) || 1 })}
              min="1"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor={`weapon-ap-${weapon.id}`}>AP</Label>
            <Input
              id={`weapon-ap-${weapon.id}`}
              type="number"
              value={weapon.armorPenetration}
              onChange={(e) => onUpdate({ armorPenetration: parseInt(e.target.value) || 0 })}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor={`weapon-damage-${weapon.id}`}>Damage</Label>
            <Input
              id={`weapon-damage-${weapon.id}`}
              value={weapon.damage}
              onChange={(e) => onUpdate({ damage: e.target.value })}
              placeholder="e.g., 1, D3, D6"
            />
          </div>
        </div>
        
        <div className="space-y-2 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between">
            <Label htmlFor={`weapon-reroll-hits-${weapon.id}`}>Reroll Hits</Label>
            <Select
              value={weapon.special_rules?.rerollHits || 'none'}
              onValueChange={(v) => onUpdate({ 
                special_rules: { 
                  ...weapon.special_rules, 
                  rerollHits: v === 'none' ? undefined : v as 'all' | 'ones' | 'failed'
                } 
              })}
            >
              <SelectTrigger id={`weapon-reroll-hits-${weapon.id}`} className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="ones">Ones</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor={`weapon-reroll-wounds-${weapon.id}`}>Reroll Wounds</Label>
            <Select
              value={weapon.special_rules?.rerollWounds || 'none'}
              onValueChange={(v) => onUpdate({ 
                special_rules: { 
                  ...weapon.special_rules, 
                  rerollWounds: v === 'none' ? undefined : v as 'all' | 'ones' | 'failed'
                } 
              })}
            >
              <SelectTrigger id={`weapon-reroll-wounds-${weapon.id}`} className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="ones">Ones</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor={`weapon-sustained-${weapon.id}`}>Sustained Hits</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Extra hits on critical hit rolls (6s)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id={`weapon-sustained-${weapon.id}`}
              type="number"
              value={weapon.special_rules?.sustainedHits || 0}
              onChange={(e) => onUpdate({ 
                special_rules: { 
                  ...weapon.special_rules, 
                  sustainedHits: parseInt(e.target.value) || 0
                } 
              })}
              min="0"
              className="w-20"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor={`weapon-lethal-${weapon.id}`}>Lethal Hits</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Critical hits (6s) automatically wound</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch
              id={`weapon-lethal-${weapon.id}`}
              checked={weapon.special_rules?.lethalHits || false}
              onCheckedChange={(checked) => onUpdate({ 
                special_rules: { ...weapon.special_rules, lethalHits: checked } 
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor={`weapon-devastating-${weapon.id}`}>Devastating Wounds</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Critical wounds (6s) bypass armor saves</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch
              id={`weapon-devastating-${weapon.id}`}
              checked={weapon.special_rules?.devastatingWounds || false}
              onCheckedChange={(checked) => onUpdate({ 
                special_rules: { ...weapon.special_rules, devastatingWounds: checked } 
              })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
