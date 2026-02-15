import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { AttackBreakdown } from '../../models/combat';

interface BreakdownTableProps {
  breakdown: AttackBreakdown[];
}

export function BreakdownTable({ breakdown }: BreakdownTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attacker</TableHead>
                <TableHead>Weapon</TableHead>
                <TableHead>Defender</TableHead>
                <TableHead className="text-right">Attacks</TableHead>
                <TableHead className="text-right">Exp. Hits</TableHead>
                <TableHead className="text-right">Exp. Damage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {breakdown.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{row.attackerName}</TableCell>
                  <TableCell>{row.weaponName}</TableCell>
                  <TableCell>{row.defenderName}</TableCell>
                  <TableCell className="text-right">{row.attacks.toFixed(1)}</TableCell>
                  <TableCell className="text-right">{row.expectedHits.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">{row.expectedDamage.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
