import { useQuery, useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { serializeScenario } from '../utils/scenarioPersistence';
import type { Scenario } from '../backend';
import type { CombatScenario } from '../models/combat';

export function useGetCurrentScenario() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const query = useQuery<Scenario | null>({
    queryKey: ['currentScenario'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCurrentScenario();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
    staleTime: Infinity, // Only fetch once on mount
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}

export function useSaveCurrentScenario() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (scenario: CombatScenario) => {
      if (!actor) throw new Error('Actor not available');
      const serialized = serializeScenario(scenario);
      return actor.saveCurrentScenario(serialized);
    },
  });
}
