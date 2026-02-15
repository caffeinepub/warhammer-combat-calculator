import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { CombatResult } from '../../models/combat';

interface SummaryCardProps {
  result: CombatResult;
}

export function SummaryCard({ result }: SummaryCardProps) {
  const totalKills = result.expectedKills.reduce((sum, k) => sum + k.modelsKilled, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Combat Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Expected Damage</p>
            <p className="text-3xl font-bold">{result.totalExpectedDamage.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Expected Kills</p>
            <p className="text-3xl font-bold">{totalKills.toFixed(1)}</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Expected Kills by Defender</h4>
          {result.expectedKills.map((kill) => (
            <div key={kill.defenderId} className="flex justify-between items-center">
              <span className="text-sm">{kill.defenderName}</span>
              <div className="text-right">
                <span className="font-medium">{kill.modelsKilled.toFixed(1)} models</span>
                {kill.overkill > 0 && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (+{kill.overkill.toFixed(1)} overkill)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
