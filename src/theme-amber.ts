import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

export const amberTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0d0f14',
      paper: '#131720',
    },
    primary: {
      main: '#e8a020',
      light: '#f5bc50',
      dark: '#b57a10',
    },
    secondary: {
      main: '#4fc3f7',
    },
    text: {
      primary: '#e8e9ed',
      secondary: '#8b92a5',
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
        body: { background: '#0d0f14' },
        '::-webkit-scrollbar': { width: '6px', height: '6px' },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': {
          background: 'rgba(232,160,32,0.25)',
          borderRadius: '3px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(232,160,32,0.5)',
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
            background: 'rgba(232,160,32,0.06)',
            borderBottom: '1px solid rgba(232,160,32,0.2)',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#e8a020',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            cursor: 'pointer',
          },
          '& .MuiDataGrid-row:hover': {
            background: 'rgba(232,160,32,0.06)',
          },
          '& .MuiDataGrid-row.Mui-selected': {
            background: 'rgba(232,160,32,0.1)',
            '&:hover': { background: 'rgba(232,160,32,0.14)' },
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid rgba(255,255,255,0.06)',
          },
          '& .MuiDataGrid-toolbarContainer': {
            padding: '8px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#131720',
          borderLeft: '1px solid rgba(232,160,32,0.15)',
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
