// Target priority logic for ordering defenders

import type { DefenderModel, PriorityMode } from '../models/combat';

export function sortDefendersByPriority(
  defenders: DefenderModel[],
  priority?: PriorityMode
): DefenderModel[] {
  if (!priority || priority === 'focus_fire' || priority === 'spread') {
    // For focus_fire and spread, use original order
    return [...defenders];
  }
  
  if (priority === 'weakest_first') {
    // Sort by wounds per model (ascending)
    return [...defenders].sort((a, b) => a.wounds - b.wounds);
  }
  
  return [...defenders];
}
