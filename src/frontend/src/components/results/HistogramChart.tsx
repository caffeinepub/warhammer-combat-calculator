import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SimulationResult } from '../../models/combat';

interface HistogramChartProps {
  result: SimulationResult;
}

export function HistogramChart({ result }: HistogramChartProps) {
  const maxCount = Math.max(...result.histogram.map(h => h.count), 1);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Damage Distribution (Simulation)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground mb-4">
            <span>Damage Range</span>
            <span>Frequency</span>
          </div>
          <div className="space-y-1">
            {result.histogram.map((bar) => (
              <div key={bar.bin} className="flex items-center gap-2">
                <span className="text-xs w-12 text-right">{bar.bin}</span>
                <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                  <div
                    className="h-full bg-chart-1 transition-all"
                    style={{ width: `${(bar.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs w-12">{bar.count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
