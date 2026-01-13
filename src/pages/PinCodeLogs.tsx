import { useState, useMemo, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { usePinCodeLogs, PinCodeLog } from '@/hooks/usePinCodeLogs';
import { PinCodeStatsCards } from '@/components/pincodes/PinCodeStatsCards';
import { PinCodeTable } from '@/components/pincodes/PinCodeTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, Download, FileSpreadsheet } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

type SortField = 'pinCode' | 'status' | 'maleCandidate' | 'femaleCandidate' | 'votedAt';
type SortDirection = 'asc' | 'desc';

export default function PinCodeLogs() {
  const { data: logs = [], isLoading, refetch, isFetching } = usePinCodeLogs();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('votedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const debouncedSearch = useDebounce(searchTerm, 300);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const filteredAndSortedLogs = useMemo(() => {
    let result = [...logs];

    // Filter
    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase();
      result = result.filter(log =>
        log.pinCode.toLowerCase().includes(search) ||
        log.status.toLowerCase().includes(search) ||
        (log.maleCandidate?.toLowerCase().includes(search)) ||
        (log.femaleCandidate?.toLowerCase().includes(search)) ||
        (log.votedAt?.toLowerCase().includes(search))
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortField] ?? '';
      let bVal = b[sortField] ?? '';

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [logs, debouncedSearch, sortField, sortDirection]);

  const stats = useMemo(() => {
    const total = logs.length;
    const voted = logs.filter(l => l.status === 'voted').length;
    const notVoted = total - voted;
    const rate = total > 0 ? ((voted / total) * 100).toFixed(1) : '0';
    return { total, voted, notVoted, rate };
  }, [logs]);

  const exportToCSV = useCallback(() => {
    const headers = ['PinCode', 'Status', 'Male Candidate', 'Female Candidate', 'Voted At'];
    const rows = filteredAndSortedLogs.map(log => [
      log.pinCode,
      log.status === 'voted' ? 'Voted' : 'Not Voted',
      log.maleCandidate || '-',
      log.femaleCandidate || '-',
      log.votedAt || '-'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pincode-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [filteredAndSortedLogs]);

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-4xl font-display font-bold golden-text">
              PinCode Logs
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mt-1">
              View and search all voting records
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-2"
            >
              <RefreshCw className={`h-5 w-5 ${isFetching ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              variant="default"
              size="lg"
              onClick={exportToCSV}
              disabled={filteredAndSortedLogs.length === 0}
              className="gap-2"
            >
              <Download className="h-5 w-5" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <PinCodeStatsCards stats={stats} isLoading={isLoading} />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by PinCode, status, candidate name, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 text-base md:text-lg bg-card border-border"
          />
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between text-base text-muted-foreground">
          <span>
            Showing <span className="font-semibold text-foreground">{filteredAndSortedLogs.length}</span> of{' '}
            <span className="font-semibold text-foreground">{logs.length}</span> records
          </span>
          {debouncedSearch && (
            <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')}>
              Clear search
            </Button>
          )}
        </div>

        {/* Table */}
        <PinCodeTable
          logs={filteredAndSortedLogs}
          isLoading={isLoading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>
    </DashboardLayout>
  );
}
