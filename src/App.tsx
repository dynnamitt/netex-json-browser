import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { useSchema } from './hooks/useSchema';
import { SchemaTable } from './components/SchemaTable';

function LoadingState() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 2,
      }}
    >
      <CircularProgress size={32} sx={{ color: 'primary.main' }} />
      <Typography
        sx={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '0.8rem',
          color: 'text.secondary',
          letterSpacing: '0.04em',
        }}
      >
        Loading NeTEx schema…
      </Typography>
    </Box>
  );
}

function AppContent() {
  const state = useSchema();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        background: '#0d0f14',
      }}
    >
      <Box
        component="header"
        sx={{
          px: 3,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: '1px solid rgba(232,160,32,0.15)',
          background: 'rgba(19,23,32,0.95)',
          backdropFilter: 'blur(8px)',
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e8a020, #f5bc50)',
              boxShadow: '0 0 8px rgba(232,160,32,0.5)',
              flexShrink: 0,
              alignSelf: 'center',
            }}
          />
          <Typography
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              fontSize: '1rem',
              color: 'text.primary',
              letterSpacing: '-0.01em',
            }}
          >
            NeTEx Schema Browser
          </Typography>
          <Typography
            sx={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '0.68rem',
              color: 'primary.main',
              background: 'rgba(232,160,32,0.1)',
              border: '1px solid rgba(232,160,32,0.2)',
              borderRadius: '3px',
              px: 0.75,
              py: 0.25,
              letterSpacing: '0.04em',
            }}
          >
            NeTEx 2.0
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        {state.status === 'ready' && (
          <Typography
            sx={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '0.7rem',
              color: 'text.secondary',
            }}
          >
            {state.rows.length.toLocaleString()} definitions
          </Typography>
        )}
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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContent />
    </ThemeProvider>
  );
}
