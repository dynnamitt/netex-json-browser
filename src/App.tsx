import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import { ThemeProvider } from '@mui/material/styles';
import { amberTheme } from './theme-amber';
import { neonTheme } from './theme-neon';
import { useSchema } from './hooks/useSchema';
import { SchemaTable } from './components/SchemaTable';

type ThemeKey = 'amber' | 'neon';

const THEMES: Record<ThemeKey, { theme: typeof amberTheme; dot: string; label: string }> = {
  amber: { theme: amberTheme, dot: '#e8a020', label: 'Amber' },
  neon:  { theme: neonTheme,  dot: '#e040fb', label: 'Neon'  },
};

function LoadingState() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2 }}>
      <CircularProgress size={32} sx={{ color: 'primary.main' }} />
      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.8rem', color: 'text.secondary', letterSpacing: '0.04em' }}>
        Loading NeTEx schema…
      </Typography>
    </Box>
  );
}

function AppContent({ themeKey, onThemeChange }: { themeKey: ThemeKey; onThemeChange: (k: ThemeKey) => void }) {
  const state = useSchema();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'background.default' }}>
      <Box
        component="header"
        sx={{
          px: 3, py: 1.5,
          display: 'flex', alignItems: 'center', gap: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'primary.main',
            bgcolor: 'primary.main',
            boxShadow: theme => `0 0 8px ${theme.palette.primary.main}88`,
          }} />
          <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '1rem', color: 'text.primary', letterSpacing: '-0.01em' }}>
            NeTEx Schema Browser
          </Typography>
          <Typography sx={{
            fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.68rem',
            color: 'primary.main',
            background: 'rgba(128,128,128,0.08)',
            border: '1px solid', borderColor: 'primary.main',
            borderRadius: '3px', px: 0.75, py: 0.25,
            opacity: 0.8,
          }}>
            NeTEx 2.0
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        {state.status === 'ready' && (
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.7rem', color: 'text.secondary' }}>
            {state.rows.length.toLocaleString()} definitions
          </Typography>
        )}

        {/* Theme swatches */}
        <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
          {(Object.keys(THEMES) as ThemeKey[]).map(k => (
            <Tooltip key={k} title={THEMES[k].label} placement="bottom">
              <Box
                onClick={() => onThemeChange(k)}
                sx={{
                  width: 14, height: 14,
                  borderRadius: '50%',
                  background: THEMES[k].dot,
                  boxShadow: k === themeKey ? `0 0 0 2px rgba(255,255,255,0.15), 0 0 8px ${THEMES[k].dot}88` : 'none',
                  cursor: 'pointer',
                  opacity: k === themeKey ? 1 : 0.4,
                  transition: 'all 0.2s',
                  '&:hover': { opacity: 1, transform: 'scale(1.2)' },
                }}
              />
            </Tooltip>
          ))}
        </Box>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {state.status === 'idle' || state.status === 'loading' ? (
          <LoadingState />
        ) : state.status === 'error' ? (
          <Box sx={{ p: 4 }}>
            <Alert severity="error" sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.8rem' }}>
              {state.message}
            </Alert>
          </Box>
        ) : (
          <SchemaTable rows={state.rows} />
        )}
      </Box>
    </Box>
  );
}

export default function App() {
  const [themeKey, setThemeKey] = useState<ThemeKey>('amber');

  return (
    <ThemeProvider theme={THEMES[themeKey].theme}>
      <CssBaseline />
      <AppContent themeKey={themeKey} onThemeChange={setThemeKey} />
    </ThemeProvider>
  );
}
