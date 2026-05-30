import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { DefinitionRow } from '../types';
import { RoleBadge } from './RoleBadge';
import { JsonViewer } from './JsonViewer';

const DRAWER_WIDTH = 480;
const XSD_BASE_URL = 'https://github.com/NeTEx-CEN/NeTEx/blob/master/xsd';

interface Props {
  row: DefinitionRow | null;
  onClose: () => void;
  onBack: () => void;
  canGoBack: boolean;
  onNavigate: (definitionName: string) => void;
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 0.75 }}>
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          minWidth: 120,
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '0.68rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          pt: '2px',
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ flex: 1, minWidth: 0 }}>{value}</Box>
    </Box>
  );
}

function XnetexAnnotations({ raw }: { raw: Record<string, unknown> }) {
  const entries = Object.entries(raw).filter(([k]) => k.startsWith('x-netex-'));
  if (entries.length === 0) return null;
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          color: 'primary.main',
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '0.65rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          display: 'block',
          mb: 1,
        }}
      >
        Annotations
      </Typography>
      {entries.map(([key, val]) => (
        <MetaRow
          key={key}
          label={key.replace('x-netex-', '')}
          value={
            <Typography
              sx={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '0.72rem',
                color: 'text.primary',
                wordBreak: 'break-all',
              }}
            >
              {Array.isArray(val) ? val.join(', ') : String(val)}
            </Typography>
          }
        />
      ))}
    </Box>
  );
}

export function DefinitionDrawer({ row, onClose, onBack, canGoBack, onNavigate }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const xsdUrl = row?.xsdLocation ? `${XSD_BASE_URL}/${row.xsdLocation}` : null;

  const content = row ? (
    <Box sx={{ p: 3, height: '100%', overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, flex: 1, minWidth: 0 }}>
          {canGoBack && (
            <IconButton
              onClick={onBack}
              size="small"
              sx={{ color: 'text.secondary', flexShrink: 0, mt: '1px', '&:hover': { color: 'primary.main' } }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          )}
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '1.05rem',
                fontWeight: 600,
                color: 'text.primary',
                lineHeight: 1.3,
                wordBreak: 'break-all',
              }}
            >
              {row.name}
            </Typography>
            <Box sx={{ mt: 0.75 }}>
              <RoleBadge role={row.netexRole} />
            </Box>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ ml: 1, color: 'text.secondary', flexShrink: 0 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2, borderColor: 'divider' }} />

      {row.description && (
        <Box sx={{ mb: 2.5 }}>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', lineHeight: 1.65, fontSize: '0.875rem' }}
          >
            {row.description}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 3 }}>
        <MetaRow
          label="XSD Source"
          value={
            xsdUrl ? (
              <Link
                href={xsdUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '0.72rem',
                  color: 'secondary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  wordBreak: 'break-all',
                  textDecorationColor: 'transparent',
                  '&:hover': { textDecorationColor: 'inherit' },
                }}
              >
                {row.xsdLocation}
                <OpenInNewIcon sx={{ fontSize: '0.75rem', flexShrink: 0 }} />
              </Link>
            ) : (
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.72rem', color: 'text.disabled' }}>
                —
              </Typography>
            )
          }
        />
      </Box>

      <Divider sx={{ mb: 2, borderColor: 'divider' }} />

      <XnetexAnnotations raw={row.raw} />

      <Divider sx={{ my: 2, borderColor: 'divider' }} />

      <Box>
        <Typography
          variant="caption"
          sx={{
            color: 'primary.main',
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '0.65rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'block',
            mb: 1,
          }}
        >
          Raw Schema
        </Typography>
        <JsonViewer value={row.raw} onNavigate={onNavigate} />
      </Box>
    </Box>
  ) : null;

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={!!row}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              maxHeight: '85vh',
              borderRadius: '12px 12px 0 0',
              background: '#131720',
              borderTop: '1px solid rgba(232,160,32,0.2)',
            },
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="right"
      variant="temporary"
      open={!!row}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: DRAWER_WIDTH } } }}
      keepMounted
    >
      {content}
    </Drawer>
  );
}
