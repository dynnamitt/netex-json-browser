import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

const P = '#e040fb';   // vivid magenta
const S = '#00e5ff';   // electric cyan
const BG = '#08090f';  // near-black with blue cast
const PAPER = '#0d0f1e';

export const neonTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: BG, paper: PAPER },
    primary:   { main: P, light: '#ea80fc', dark: '#ab00c7' },
    secondary: { main: S },
    text: {
      primary: '#eef0ff',
      secondary: '#7b82b0',
    },
    divider: 'rgba(255,255,255,0.06)',
  },
  typography: {
    fontFamily: '"Outfit", "Segoe UI", sans-serif',
    h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
    body1: { fontFamily: '"Outfit", sans-serif' },
    body2: { fontFamily: '"Outfit", sans-serif' },
    caption: { fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.72rem' },
    overline: { fontFamily: '"Outfit", sans-serif' },
  },
  shape: { borderRadius: 6 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box' },
        body: { background: BG },
        '::-webkit-scrollbar': { width: '6px', height: '6px' },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': {
          background: 'rgba(224,64,251,0.3)',
          borderRadius: '3px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(224,64,251,0.55)',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          background: 'transparent',
          fontFamily: '"Outfit", sans-serif',
          '& .MuiDataGrid-columnHeaders': {
            background: 'rgba(224,64,251,0.07)',
            borderBottom: `1px solid rgba(224,64,251,0.22)`,
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: P,
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            cursor: 'pointer',
          },
          '& .MuiDataGrid-row:hover': {
            background: 'rgba(224,64,251,0.07)',
          },
          '& .MuiDataGrid-row.Mui-selected': {
            background: 'rgba(224,64,251,0.12)',
            '&:hover': { background: 'rgba(224,64,251,0.16)' },
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid rgba(255,255,255,0.06)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: PAPER,
          borderLeft: `1px solid rgba(224,64,251,0.18)`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '0.68rem',
          fontWeight: 500,
          height: '22px',
          letterSpacing: '0.02em',
        },
      },
    },
  },
});
