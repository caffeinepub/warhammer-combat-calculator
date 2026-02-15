import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useScenarioState } from './state/useScenarioState';
import { ScenarioBuilder } from './components/scenario/ScenarioBuilder';
import { ResultsDisplay } from './components/results/ResultsDisplay';
import { AuthControls } from './components/auth/AuthControls';
import { Separator } from '@/components/ui/separator';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCurrentScenario, useSaveCurrentScenario } from './hooks/useCurrentScenarioPersistence';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import { deserializeScenario } from './utils/scenarioPersistence';

function App() {
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const {
    scenario,
    addAttacker,
    removeAttacker,
    updateAttacker,
    addWeaponToAttacker,
    removeWeaponFromAttacker,
    updateWeapon,
    addDefender,
    removeDefender,
    updateDefender,
    setPriority,
    replaceScenario
  } = useScenarioState();
  
  // Load saved scenario on authentication
  const { data: savedScenario, isLoading: loadingScenario } = useGetCurrentScenario();
  
  // Restore saved scenario once on mount when authenticated
  useEffect(() => {
    if (isAuthenticated && savedScenario && !loadingScenario) {
      try {
        const restoredScenario = deserializeScenario(savedScenario);
        replaceScenario(restoredScenario);
      } catch (error) {
        console.error('Failed to restore saved scenario:', error);
      }
    }
  }, [isAuthenticated, savedScenario, loadingScenario]);
  
  // Debounced autosave
  const debouncedScenario = useDebouncedValue(scenario, 2000);
  const { mutate: saveScenario } = useSaveCurrentScenario();
  
  useEffect(() => {
    if (isAuthenticated && debouncedScenario) {
      // Only save if there's actual content
      if (debouncedScenario.attackers.length > 0 || debouncedScenario.defenders.length > 0) {
        saveScenario(debouncedScenario);
      }
    }
  }, [isAuthenticated, debouncedScenario, saveScenario]);
  
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'warhammer-calculator'
  );
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Warhammer Combat Calculator</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate expected damage and simulate combat outcomes
              </p>
            </div>
            <AuthControls />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-6">Build Your Scenario</h2>
            <ScenarioBuilder
              scenario={scenario}
              attackers={scenario.attackers}
              defenders={scenario.defenders}
              priority={scenario.priority || 'focus_fire'}
              onAddAttacker={addAttacker}
              onRemoveAttacker={removeAttacker}
              onUpdateAttacker={updateAttacker}
              onAddWeapon={addWeaponToAttacker}
              onRemoveWeapon={removeWeaponFromAttacker}
              onUpdateWeapon={updateWeapon}
              onAddDefender={addDefender}
              onRemoveDefender={removeDefender}
              onUpdateDefender={updateDefender}
              onSetPriority={setPriority}
              onReplaceScenario={replaceScenario}
            />
          </section>
          
          <Separator className="my-8" />
          
          <section>
            <ResultsDisplay scenario={scenario} />
          </section>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/40 mt-16 py-8 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Warhammer Combat Calculator
            </p>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
