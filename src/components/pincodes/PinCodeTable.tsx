import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PinCodeLog } from '@/hooks/usePinCodeLogs';
import { ArrowUpDown, ArrowUp, ArrowDown, CheckCircle2, Clock, FileX } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortField = 'pinCode' | 'status' | 'maleCandidate' | 'femaleCandidate' | 'votedAt';
type SortDirection = 'asc' | 'desc';

interface PinCodeTableProps {
  logs: PinCodeLog[];
  isLoading: boolean;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const columns: { key: SortField; label: string; className?: string }[] = [
  { key: 'pinCode', label: 'PinCode', className: 'w-[120px]' },
  { key: 'status', label: 'Status', className: 'w-[140px]' },
  { key: 'maleCandidate', label: 'Male Candidate' },
  { key: 'femaleCandidate', label: 'Female Candidate' },
  { key: 'votedAt', label: 'Voted At', className: 'w-[180px]' },
];

function SortIcon({ field, sortField, sortDirection }: { 
  field: SortField; 
  sortField: SortField; 
  sortDirection: SortDirection 
}) {
  if (field !== sortField) {
    return <ArrowUpDown className="h-4 w-4 text-muted-foreground/50" />;
  }
  return sortDirection === 'asc' 
    ? <ArrowUp className="h-4 w-4 text-primary" />
    : <ArrowDown className="h-4 w-4 text-primary" />;
}

function LoadingRows() {
  return Array.from({ length: 10 }).map((_, i) => (
    <TableRow key={i}>
      {columns.map((col) => (
        <TableCell key={col.key}>
          <Skeleton className="h-6 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-64">
        <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <FileX className="h-12 w-12" />
          <p className="text-lg font-medium">No records found</p>
          <p className="text-sm">Try adjusting your search terms</p>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function PinCodeTable({
  logs,
  isLoading,
  sortField,
  sortDirection,
  onSort,
}: PinCodeTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-auto max-h-[600px]">
        <Table>
          <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    'cursor-pointer select-none transition-colors hover:bg-muted h-14 text-sm md:text-base font-semibold',
                    col.className
                  )}
                  onClick={() => onSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    <SortIcon field={col.key} sortField={sortField} sortDirection={sortDirection} />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoadingRows />
            ) : logs.length === 0 ? (
              <EmptyState />
            ) : (
              logs.map((log, idx) => (
                <TableRow
                  key={`${log.pinCode}-${idx}`}
                  className="transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-mono text-base md:text-lg font-semibold text-primary">
                    {log.pinCode}
                  </TableCell>
                  <TableCell>
                    {log.status === 'voted' ? (
                      <Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/20 border-green-500/30 gap-1.5 text-sm px-3 py-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Voted
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1.5 text-sm px-3 py-1">
                        <Clock className="h-4 w-4" />
                        Not Voted
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm md:text-base">
                    {log.maleCandidate || <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-sm md:text-base">
                    {log.femaleCandidate || <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-sm md:text-base text-muted-foreground">
                    {log.votedAt || <span>—</span>}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
