import React from 'react';
import Box from '@mui/material/Box';

interface Props {
  value: unknown;
  onNavigate: (definitionName: string) => void;
  depth?: number;
}

const C = {
  key:     '#e8a020',   // amber
  str:     '#86efac',   // sage green
  num:     '#67e8f9',   // cyan
  bool:    '#c084fc',   // violet
  null:    '#64748b',   // slate
  brace:   '#4b5563',   // dim gray
  ref:     '#60a5fa',   // blue — clickable $ref target
};

const INDENT = 2;

function Indent({ depth }: { depth: number }) {
  return <span>{' '.repeat(depth * INDENT)}</span>;
}

function RefLink({ target, onNavigate }: { target: string; onNavigate: (name: string) => void }) {
  const defName = target.replace(/^#\/definitions\//, '');
  const isResolvable = target.startsWith('#/definitions/');
  return (
    <Box
      component="span"
      onClick={isResolvable ? () => onNavigate(defName) : undefined}
      sx={{
        color: C.ref,
        cursor: isResolvable ? 'pointer' : 'default',
        textDecoration: isResolvable ? 'underline' : 'none',
        textDecorationColor: 'rgba(96,165,250,0.4)',
        '&:hover': isResolvable ? {
          color: '#93c5fd',
          textDecorationColor: '#93c5fd',
        } : {},
      }}
    >
      &quot;{target}&quot;
    </Box>
  );
}

function JsonVal({ value, onNavigate, depth, isRefValue }: {
  value: unknown;
  onNavigate: (name: string) => void;
  depth: number;
  isRefValue?: boolean;
}) {
  if (value === null) {
    return <span style={{ color: C.null }}>null</span>;
  }
  if (typeof value === 'boolean') {
    return <span style={{ color: C.bool }}>{String(value)}</span>;
  }
  if (typeof value === 'number') {
    return <span style={{ color: C.num }}>{value}</span>;
  }
  if (typeof value === 'string') {
    if (isRefValue) {
      return <RefLink target={value} onNavigate={onNavigate} />;
    }
    return <span style={{ color: C.str }}>&quot;{value}&quot;</span>;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span style={{ color: C.brace }}>[]</span>;
    }
    return (
      <>
        <span style={{ color: C.brace }}>[</span>
        {'\n'}
        {value.map((item, i) => (
          <React.Fragment key={i}>
            <Indent depth={depth + 1} />
            <JsonVal value={item} onNavigate={onNavigate} depth={depth + 1} />
            {i < value.length - 1 && <span style={{ color: C.brace }}>,</span>}
            {'\n'}
          </React.Fragment>
        ))}
        <Indent depth={depth} />
        <span style={{ color: C.brace }}>]</span>
      </>
    );
  }
  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return <span style={{ color: C.brace }}>{'{}'}</span>;
    }
    return (
      <>
        <span style={{ color: C.brace }}>{'{'}</span>
        {'\n'}
        {entries.map(([k, v], i) => (
          <React.Fragment key={k}>
            <Indent depth={depth + 1} />
            <span style={{ color: C.key }}>&quot;{k}&quot;</span>
            <span style={{ color: C.brace }}>: </span>
            <JsonVal value={v} onNavigate={onNavigate} depth={depth + 1} isRefValue={k === '$ref'} />
            {i < entries.length - 1 && <span style={{ color: C.brace }}>,</span>}
            {'\n'}
          </React.Fragment>
        ))}
        <Indent depth={depth} />
        <span style={{ color: C.brace }}>{'}'}</span>
      </>
    );
  }
  return <span style={{ color: C.null }}>undefined</span>;
}

export function JsonViewer({ value, onNavigate, depth = 0 }: Props) {
  return (
    <Box
      component="pre"
      sx={{
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '0.68rem',
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 1,
        p: 1.5,
        m: 0,
        overflowX: 'auto',
        lineHeight: 1.65,
        whiteSpace: 'pre',
        wordBreak: 'normal',
      }}
    >
      <JsonVal value={value} onNavigate={onNavigate} depth={depth} />
    </Box>
  );
}
