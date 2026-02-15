import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SummaryCard } from './SummaryCard';
import { BreakdownTable } from './BreakdownTable';
import { DamageChart } from './DamageChart';
import { HistogramChart } from './HistogramChart';
import { SimulationControls } from './SimulationControls';
import { ChanceToKillCard } from './ChanceToKillCard';
import { ExportButton } from './ExportButton';
import { resolveScenario } from '../../engine/resolveScenario';
import { runSimulation } from '../../engine/simulation';
import type { CombatScenario, CombatResult, SimulationResult } from '../../models/combat';

interface ResultsDisplayProps {
  scenario: CombatScenario;
}

export function ResultsDisplay({ scenario }: ResultsDisplayProps) {
  const [mode, setMode] = useState<'deterministic' | 'simulation'>('deterministic');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedDefenderId, setSelectedDefenderId] = useState<string | null>(null);
  
  // Calculate deterministic results
  const deterministicResult: CombatResult = resolveScenario(scenario);
  
  const handleRunSimulation = async (iterations: number) => {
    setIsSimulating(true);
    
    // Run simulation in a setTimeout to allow UI to update
    setTimeout(() => {
      const result = runSimulation(scenario, iterations);
      setSimulationResult(result);
      setIsSimulating(false);
      setMode('simulation');
    }, 100);
  };
  
  const hasData = scenario.attackers.length > 0 && scenario.defenders.length > 0;
  
  if (!hasData) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <p>Add attackers and defenders to see combat results</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Combat Results</h2>
        <ExportButton scenario={scenario} result={deterministicResult} />
      </div>
      
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'deterministic' | 'simulation')}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="deterministic">Expected Values</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="deterministic" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SummaryCard result={deterministicResult} />
            <ChanceToKillCard
              defenders={scenario.defenders}
              result={deterministicResult}
              selectedDefenderId={selectedDefenderId}
              onSelectDefender={setSelectedDefenderId}
            />
          </div>
          
          <DamageChart result={deterministicResult} />
          <BreakdownTable breakdown={deterministicResult.breakdown} />
        </TabsContent>
        
        <TabsContent value="simulation" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {simulationResult ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Simulation Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Mean</p>
                          <p className="text-2xl font-bold">{simulationResult.mean.toFixed(2)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Median</p>
                          <p className="text-2xl font-bold">{simulationResult.median.toFixed(2)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">95th %ile</p>
                          <p className="text-2xl font-bold">{simulationResult.percentile95.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <HistogramChart result={simulationResult} />
                </>
              ) : (
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center text-muted-foreground">
                      <p>Run a simulation to see probability distributions</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <SimulationControls
              onRunSimulation={handleRunSimulation}
              isRunning={isSimulating}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
