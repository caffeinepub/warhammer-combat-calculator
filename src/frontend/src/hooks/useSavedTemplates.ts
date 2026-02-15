import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SavedTemplate, Scenario } from '../backend';

export function useGetCallerTemplates() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<SavedTemplate[]>({
    queryKey: ['templates'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerTemplates();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}

export function useSaveTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, scenario }: { name: string; scenario: Scenario }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveTemplate(name, scenario);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

export function useDeleteTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTemplate(templateId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}
