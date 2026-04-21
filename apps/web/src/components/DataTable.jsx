import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
  TextField,
  Typography,
} from '@mui/material';
import { ArrowDownAZ, ArrowUpAZ, Search } from 'lucide-react';

function coerceComparable(value) {
  if (value == null) {
    return '';
  }

  const date = new Date(value);
  if (!Number.isNaN(date.getTime()) && String(value).includes('-')) {
    return date.getTime();
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const numeric = Number(value.replace(/,/g, ''));
    if (!Number.isNaN(numeric) && value.trim() !== '') {
      return numeric;
    }
    return value.toLowerCase();
  }

  return String(value).toLowerCase();
}

export default function DataTable({
  title,
  subtitle,
  actions,
  columns = [],
  data = [],
  filters = [],
  rowKey = 'id',
  searchKeys,
  searchPlaceholder = 'Search records...',
  summary,
  emptyTitle = 'No results found',
  emptyMessage = 'Try adjusting your search, filter, or sort settings.',
  defaultPageSize = 10,
}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [filterState, setFilterState] = useState(() =>
    Object.fromEntries(filters.map((item) => [item.key, 'all'])),
  );

  const filterSignature = useMemo(
    () => filters.map((filter) => filter.key).join('|'),
    [filters],
  );

  useEffect(() => {
    setFilterState((current) => {
      const next = {};
      for (const filter of filters) {
        next[filter.key] = current[filter.key] || 'all';
      }
      return next;
    });
  }, [filterSignature]);

  const processedRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    let rows = [...(Array.isArray(data) ? data : [])];

    rows = rows.filter((row) => {
      for (const filter of filters) {
        const selected = filterState[filter.key];
        if (!selected || selected === 'all') {
          continue;
        }

        const value = String(row?.[filter.key] ?? '').toLowerCase();
        if (value !== String(selected).toLowerCase()) {
          return false;
        }
      }

      if (!normalizedQuery) {
        return true;
      }

      const keys = searchKeys && searchKeys.length ? searchKeys : Object.keys(row || {});
      return keys.some((key) => String(row?.[key] ?? '').toLowerCase().includes(normalizedQuery));
    });

    if (sort) {
      rows.sort((left, right) => {
        const leftValue = coerceComparable(left?.[sort.key]);
        const rightValue = coerceComparable(right?.[sort.key]);

        if (leftValue < rightValue) {
          return sort.direction === 'asc' ? -1 : 1;
        }
        if (leftValue > rightValue) {
          return sort.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return rows;
  }, [data, filters, filterState, query, searchKeys, sort]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(processedRows.length / pageSize) - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [page, pageSize, processedRows.length]);

  const paginatedRows = useMemo(() => {
    const start = page * pageSize;
    return processedRows.slice(start, start + pageSize);
  }, [page, pageSize, processedRows]);

  function toggleSort(key) {
    setPage(0);
    setSort((current) => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
    });
  }

  function setFilterValue(key, value) {
    setPage(0);
    setFilterState((current) => ({ ...current, [key]: value }));
  }

  return (
    <Card className="table-shell">
      {(title || subtitle || actions) ? (
        <CardHeader
          title={title || null}
          subheader={subtitle || null}
          action={actions || null}
          titleTypographyProps={{ fontSize: '1.03rem', fontWeight: 800 }}
          subheaderTypographyProps={{ fontSize: '0.84rem', color: 'text.secondary' }}
        />
      ) : null}

      <CardContent sx={{ pt: title || subtitle || actions ? 0.5 : 2 }}>
        <Box
          className="table-toolbar"
          sx={{
            mb: 1.8,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(280px, 1fr) repeat(3, minmax(0, 220px))' },
            gap: 1,
            alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
            size="small"
            value={query}
            onChange={(event) => {
              setPage(0);
              setQuery(event.target.value);
            }}
            placeholder={searchPlaceholder}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            }}
          />

          {filters.map((filter) => (
            <FormControl key={filter.key} size="small">
              <InputLabel>{filter.label}</InputLabel>
              <Select
                label={filter.label}
                value={filterState[filter.key] || 'all'}
                onChange={(event) => setFilterValue(filter.key, event.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                {(filter.options || []).map((option) => (
                  <MenuItem key={String(option.value)} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}

          <Box sx={{ justifySelf: { xs: 'stretch', lg: 'end' } }}>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', textAlign: { xs: 'left', lg: 'right' } }}>
              {summary || `Showing ${processedRows.length} records`}
            </Typography>
          </Box>
        </Box>

        <div className="table-container table-responsive">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead>
              <tr>
                {columns.map((column) => {
                  const activeSort = sort?.key === column.key ? sort.direction : null;
                  const ariaSort = activeSort || 'none';
                  return (
                    <th
                      key={column.key}
                      aria-sort={ariaSort}
                      style={{
                        cursor: column.sortable ? 'pointer' : 'default',
                        width: column.width || 'auto',
                        textAlign: column.align || 'left',
                      }}
                      onClick={() => column.sortable ? toggleSort(column.key) : undefined}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {column.label}
                        {column.sortable ? (
                          activeSort === 'asc'
                            ? <ArrowUpAZ size={14} />
                            : activeSort === 'desc'
                              ? <ArrowDownAZ size={14} />
                              : <ArrowUpAZ size={14} style={{ opacity: 0.35 }} />
                        ) : null}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row, index) => (
                <tr key={row?.[rowKey] || `${rowKey}-${index}`}>
                  {columns.map((column) => (
                    <td key={column.key} style={{ textAlign: column.align || 'left' }}>
                      {column.render ? column.render(row?.[column.key], row) : row?.[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
              {!paginatedRows.length ? (
                <tr>
                  <td colSpan={columns.length}>
                    <div className="empty-state compact">
                      <h3>{emptyTitle}</h3>
                      <p>{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 20, 50]}
          count={processedRows.length}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={(_, nextPage) => setPage(nextPage)}
          onRowsPerPageChange={(event) => {
            setPage(0);
            setPageSize(Number(event.target.value));
          }}
          sx={{ mt: 1, '.MuiTablePagination-toolbar': { px: 0 } }}
        />
      </CardContent>
    </Card>
  );
}
