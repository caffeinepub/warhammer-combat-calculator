import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { calculateChanceToKill } from '../../engine/chanceToKill';
import type { DefenderModel, CombatResult } from '../../models/combat';

interface ChanceToKillCardProps {
  defenders: DefenderModel[];
  result: CombatResult;
  selectedDefenderId: string | null;
  onSelectDefender: (id: string) => void;
}

export function ChanceToKillCard({
  defenders,
  result,
  selectedDefenderId,
  onSelectDefender
}: ChanceToKillCardProps) {
  const selectedDefender = defenders.find(d => d.id === selectedDefenderId);
  
  let chanceToKill = 0;
  if (selectedDefender) {
    chanceToKill = calculateChanceToKill(selectedDefender, result, 1);
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Chance to Kill</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">
                  Probability of killing at least 1 model from the selected defender unit
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="defender-select">Select Defender</Label>
          <Select
            value={selectedDefenderId || ''}
            onValueChange={onSelectDefender}
          >
            <SelectTrigger id="defender-select">
              <SelectValue placeholder="Choose a defender..." />
            </SelectTrigger>
            <SelectContent>
              {defenders.map((defender) => (
                <SelectItem key={defender.id} value={defender.id}>
                  {defender.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedDefender && (
          <div className="text-center py-4">
            <p className="text-4xl font-bold text-primary">
              {(chanceToKill * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Chance to kill ≥1 model
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
