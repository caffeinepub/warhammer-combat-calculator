import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play } from 'lucide-react';

interface SimulationControlsProps {
  onRunSimulation: (iterations: number) => void;
  isRunning: boolean;
}

export function SimulationControls({ onRunSimulation, isRunning }: SimulationControlsProps) {
  const [iterations, setIterations] = useState(10000);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Monte Carlo Simulation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="iterations">Iterations</Label>
          <Input
            id="iterations"
            type="number"
            value={iterations}
            onChange={(e) => setIterations(parseInt(e.target.value) || 10000)}
            min="100"
            max="100000"
            step="1000"
            disabled={isRunning}
          />
          <p className="text-xs text-muted-foreground">
            Higher iterations = more accurate results (slower)
          </p>
        </div>
        
        <Button
          onClick={() => onRunSimulation(iterations)}
          disabled={isRunning}
          className="w-full"
        >
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? 'Running...' : 'Run Simulation'}
        </Button>
        
        {isRunning && (
          <Progress value={undefined} className="w-full" />
        )}
      </CardContent>
    </Card>
  );
}
