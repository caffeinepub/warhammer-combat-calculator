import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Download } from 'lucide-react';
import { exportToJSON, exportToCSV } from '../../utils/exportResults';
import type { CombatScenario, CombatResult } from '../../models/combat';

interface ExportButtonProps {
  scenario: CombatScenario;
  result: CombatResult;
}

export function ExportButton({ scenario, result }: ExportButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Results
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => exportToJSON(scenario, result)}>
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToCSV(result)}>
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
