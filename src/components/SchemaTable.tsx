import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DefinitionRow } from '../types';
import { RoleBadge } from './RoleBadge';
import { DefinitionDrawer } from './DefinitionDrawer';

const XSD_BASE_URL = 'https://github.com/NeTEx-CEN/NeTEx/blob/master/xsd';

const COLUMNS: GridColDef<DefinitionRow>[] = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 2,
    minWidth: 220,
    renderCell: (params: GridRenderCellParams<DefinitionRow>) => (
      <Box
        sx={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '0.8rem',
          fontWeight: 500,
          color: '#e8e9ed',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {params.value as string}
      </Box>
    ),
  },
  {
    field: 'description',
    headerName: 'Descr.',
    sortable: false,
    filterable: false,
    width: 48,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params: GridRenderCellParams<DefinitionRow>) => {
      const description = params.row.description;
      if (!description) return null;
      return (
        <Tooltip title={description} placement="bottom-start">
          <InfoOutlinedIcon
            sx={{
              fontSize: '1rem',
              color: 'text.secondary',
              cursor: 'help',
              '&:hover': { color: 'primary.main' },
            }}
          />
        </Tooltip>
      );
    },
  },
  {
    field: 'netexRole',
    headerName: 'NeTEx Role',
    flex: 0.8,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams<DefinitionRow>) => (
      <RoleBadge role={params.value as string} />
    ),
  },
  {
    field: 'xsdLocation',
    headerName: 'XSD Location',
    flex: 3,
    minWidth: 260,
    renderCell: (params: GridRenderCellParams<DefinitionRow>) => {
      const loc = params.value as string;
      if (!loc) return <Box sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>—</Box>;
      return (
        <Link
          href={`${XSD_BASE_URL}/${loc}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          sx={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '0.72rem',
            color: 'secondary.main',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            overflow: 'hidden',
            textDecorationColor: 'transparent',
            '&:hover': { textDecorationColor: 'inherit' },
            maxWidth: '100%',
          }}
        >
          <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {loc}
          </Box>
          <OpenInNewIcon sx={{ fontSize: '0.7rem', flexShrink: 0 }} />
        </Link>
      );
    },
  },
];

const SELECT_SX = {
  minWidth: 160,
  height: 40,
  fontFamily: '"IBM Plex Mono", monospace',
  fontSize: '0.78rem',
  background: 'rgba(255,255,255,0.03)',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(232,160,32,0.4)' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(232,160,32,0.7)' },
  '& .MuiSelect-icon': { color: 'text.secondary' },
};

interface Props {
  rows: DefinitionRow[];
}

export function SchemaTable({ rows }: Props) {
  const [selected, setSelected] = useState<DefinitionRow | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [navDepth, setNavDepth] = useState(0);

  const uniqueRoles = useMemo(
    () => Array.from(new Set(rows.map(r => r.netexRole))).sort(),
    [rows]
  );

  const displayRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const hasRoleFilter = roleFilter.length > 0;

    return rows.filter(r => {
      if (q && !r.name.toLowerCase().includes(q) && !r.xsdLocation.toLowerCase().includes(q)) {
        return false;
      }
      if (hasRoleFilter && !roleFilter.includes(r.netexRole)) {
        return false;
      }
      return true;
    });
  }, [rows, search, roleFilter]);

  const rowMap = useMemo(
    () => new Map(rows.map(r => [r.id, r])),
    [rows]
  );

  const restoredRef = useRef(false);

  // Restore selected def from URL on initial data load
  useEffect(() => {
    if (restoredRef.current || rowMap.size === 0) return;
    restoredRef.current = true;
    const def = new URLSearchParams(window.location.search).get('def');
    if (def) {
      const row = rowMap.get(def);
      if (row) {
        setSelected(row);
        window.history.replaceState({ def }, '', window.location.search);
      }
    }
  }, [rowMap]);

  // Sync state when user navigates with browser back/forward
  useEffect(() => {
    const handler = (e: PopStateEvent) => {
      const def = (e.state as { def?: string } | null)?.def;
      setSelected(def ? (rowMap.get(def) ?? null) : null);
      setNavDepth(d => Math.max(0, d - 1));
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [rowMap]);

  const selectDefinition = useCallback((row: DefinitionRow) => {
    setSelected(row);
    setNavDepth(d => d + 1);
    window.history.pushState({ def: row.name }, '', `?def=${encodeURIComponent(row.name)}`);
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
    setNavDepth(0);
    window.history.pushState({}, '', window.location.pathname);
  }, []);

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleRowClick = useCallback(
    (params: { id: string | number }) => {
      const row = rowMap.get(String(params.id));
      if (row) selectDefinition(row);
    },
    [rowMap, selectDefinition]
  );

  const handleNavigate = useCallback(
    (definitionName: string) => {
      const row = rowMap.get(definitionName);
      if (row) selectDefinition(row);
    },
    [rowMap, selectDefinition]
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          px: 2,
          py: 1.25,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <TextField
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search definitions…"
          size="small"
          sx={{ flex: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                </InputAdornment>
              ),
              sx: {
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '0.82rem',
                background: 'rgba(255,255,255,0.03)',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(232,160,32,0.4)' },
                '&.Mui-focused fieldset': { borderColor: 'rgba(232,160,32,0.7)' },
              },
            },
          }}
        />

        <Select
          multiple
          displayEmpty
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value as string[])}
          sx={SELECT_SX}
          startAdornment={
            <InputAdornment position="start" sx={{ ml: 0.5, mr: -0.5 }}>
              <FilterListIcon sx={{ fontSize: '0.9rem', color: roleFilter.length > 0 ? 'primary.main' : 'text.secondary' }} />
            </InputAdornment>
          }
          renderValue={selected =>
            selected.length === 0 ? (
              <Typography sx={{ color: 'text.secondary', fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.78rem' }}>
                All roles
              </Typography>
            ) : (
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.78rem', color: 'primary.main' }}>
                {selected.length === 1 ? selected[0].replace('/deprecated', ' ⊘') : `${selected.length} roles`}
              </Typography>
            )
          }
          MenuProps={{
            slotProps: {
              paper: {
                sx: {
                  background: '#1a1f2e',
                  border: '1px solid rgba(232,160,32,0.15)',
                  maxHeight: 360,
                },
              },
            },
          }}
        >
          {uniqueRoles.map(role => (
            <MenuItem key={role} value={role} dense sx={{ gap: 1, py: 0.75 }}>
              <Checkbox
                checked={roleFilter.includes(role)}
                size="small"
                sx={{
                  p: 0.25,
                  color: 'text.secondary',
                  '&.Mui-checked': { color: 'primary.main' },
                }}
              />
              <ListItemText
                primary={<RoleBadge role={role} />}
                disableTypography
              />
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <DataGrid
          rows={displayRows}
          columns={COLUMNS}
          onRowClick={handleRowClick}
          density="compact"
          disableRowSelectionOnClick={false}
          pageSizeOptions={[25, 50, 100]}
          initialState={{ pagination: { paginationModel: { pageSize: 100 } } }}
          sx={{ height: '100%', border: 'none' }}
        />
      </Box>

      <DefinitionDrawer
        row={selected}
        onClose={handleClose}
        onBack={handleBack}
        canGoBack={navDepth > 0}
        onNavigate={handleNavigate}
      />
    </Box>
  );
}
