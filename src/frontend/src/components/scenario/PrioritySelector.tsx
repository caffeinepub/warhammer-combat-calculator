import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PriorityMode } from '../../models/combat';

interface PrioritySelectorProps {
  priority: PriorityMode;
  onChange: (priority: PriorityMode) => void;
}

export function PrioritySelector({ priority, onChange }: PrioritySelectorProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Target Priority</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="priority-select">Allocation Mode</Label>
          <Select value={priority} onValueChange={(v) => onChange(v as PriorityMode)}>
            <SelectTrigger id="priority-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="focus_fire">Focus Fire</SelectItem>
              <SelectItem value="spread">Spread Damage</SelectItem>
              <SelectItem value="weakest_first">Weakest First</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {priority === 'focus_fire' && 'Concentrate all attacks on targets in order'}
            {priority === 'spread' && 'Distribute damage evenly across all targets'}
            {priority === 'weakest_first' && 'Target units with lowest wounds per model first'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
