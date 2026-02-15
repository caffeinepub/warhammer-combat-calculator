import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CombatResult } from '../../models/combat';

interface DamageChartProps {
  result: CombatResult;
}

export function DamageChart({ result }: DamageChartProps) {
  const defenderData = Array.from(result.damageByDefender.entries()).map(([id, damage]) => {
    const kill = result.expectedKills.find(k => k.defenderId === id);
    return {
      id,
      name: kill?.defenderName || id,
      damage
    };
  });
  
  const maxDamage = Math.max(...defenderData.map(d => d.damage), 1);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Damage Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {defenderData.map((data) => (
            <div key={data.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{data.name}</span>
                <span className="text-sm text-muted-foreground">{data.damage.toFixed(2)}</span>
              </div>
              <div className="h-8 bg-muted rounded-md overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(data.damage / maxDamage) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
