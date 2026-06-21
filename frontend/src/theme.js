import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2952A3' },
    secondary: { main: '#5B6B7C' },
    background: { default: '#F5F6F8', paper: '#FFFFFF' },
    success: { main: '#2E7D32' },
    warning: { main: '#B8860B' },
    error: { main: '#C62828' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiAppBar: { styleOverrides: { root: { boxShadow: 'none', borderBottom: '1px solid #E0E3E7' } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
  },
});
