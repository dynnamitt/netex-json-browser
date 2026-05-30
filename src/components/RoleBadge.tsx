import React from 'react';
import Chip from '@mui/material/Chip';

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  entity:      { bg: 'rgba(52,211,153,0.15)',  color: '#34d399' },
  reference:   { bg: 'rgba(96,165,250,0.15)',  color: '#60a5fa' },
  structure:   { bg: 'rgba(139,92,246,0.15)',  color: '#a78bfa' },
  view:        { bg: 'rgba(232,121,249,0.15)', color: '#e879f9' },
  collection:  { bg: 'rgba(34,211,238,0.15)',  color: '#22d3ee' },
  enumeration: { bg: 'rgba(251,146,60,0.15)',  color: '#fb923c' },
  enumList:    { bg: 'rgba(251,146,60,0.12)',  color: '#fda96a' },
  abstract:    { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8' },
  primitive:   { bg: 'rgba(232,160,32,0.12)',  color: '#d4a020' },
  union:       { bg: 'rgba(168,85,247,0.12)',  color: '#c084fc' },
  unknown:     { bg: 'rgba(100,116,139,0.08)', color: '#475569' },
};

interface Props {
  role: string;
}

export function RoleBadge({ role }: Props) {
  const isDeprecated = role.endsWith('/deprecated');
  const baseRole = isDeprecated ? role.replace('/deprecated', '') : role;
  const style = ROLE_COLORS[baseRole] ?? ROLE_COLORS.unknown;

  return (
    <Chip
      label={isDeprecated ? `${baseRole} ⊘` : baseRole}
      size="small"
      sx={{
        background: isDeprecated ? 'rgba(100,116,139,0.06)' : style.bg,
        color: isDeprecated ? '#475569' : style.color,
        border: `1px solid ${isDeprecated ? 'rgba(100,116,139,0.15)' : `${style.color}33`}`,
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '0.65rem',
        fontWeight: 600,
        height: '20px',
        textDecoration: isDeprecated ? 'line-through' : 'none',
        opacity: isDeprecated ? 0.6 : 1,
      }}
    />
  );
}
