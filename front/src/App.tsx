import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import MyRoutes from './router';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a6b6f',
      light: '#2a8f94',
      dark: '#0f4a4d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4fa89a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a2332',
      secondary: '#5a6a7a',
    },
    divider: '#e8ecf0',
    error: { main: '#d94f4f' },
    warning: { main: '#e8943a' },
    success: { main: '#2e9e6b' },
    info: { main: '#3a7fc1' },
  },
  typography: {
    fontFamily:
      // eslint-disable-next-line max-len
      'Inter, \'PingFang SC\', \'Microsoft YaHei\', sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: { fontWeight: 600 },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: { borderRadius: 8 },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    '0 2px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
    '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05)',
    '0 6px 20px rgba(0,0,0,0.09)',
    '0 8px 24px rgba(0,0,0,0.10)',
    '0 10px 30px rgba(0,0,0,0.11)',
    '0 12px 36px rgba(0,0,0,0.12)',
    '0 14px 40px rgba(0,0,0,0.12)',
    '0 16px 48px rgba(0,0,0,0.13)',
    '0 18px 52px rgba(0,0,0,0.13)',
    '0 20px 56px rgba(0,0,0,0.14)',
    '0 22px 60px rgba(0,0,0,0.14)',
    '0 24px 64px rgba(0,0,0,0.15)',
    '0 26px 68px rgba(0,0,0,0.15)',
    '0 28px 72px rgba(0,0,0,0.16)',
    '0 30px 76px rgba(0,0,0,0.16)',
    '0 32px 80px rgba(0,0,0,0.17)',
    '0 34px 84px rgba(0,0,0,0.17)',
    '0 36px 88px rgba(0,0,0,0.18)',
    '0 38px 92px rgba(0,0,0,0.18)',
    '0 40px 96px rgba(0,0,0,0.19)',
    '0 42px 100px rgba(0,0,0,0.19)',
    '0 44px 104px rgba(0,0,0,0.20)',
    '0 46px 108px rgba(0,0,0,0.20)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 6,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          background: '#1a6b6f',
          '&:hover': { background: '#0f4a4d' },
        },
        outlinedPrimary: {
          borderColor: '#c8d8da',
          color: '#1a6b6f',
          '&:hover': {
            borderColor: '#1a6b6f',
            background: 'rgba(26,107,111,0.04)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            '& fieldset': {
              borderColor: '#dde3e8',
            },
            '&:hover fieldset': {
              borderColor: '#a0b4b8',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1a6b6f',
              borderWidth: 1.5,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#dde3e8',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#a0b4b8',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1a6b6f',
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        elevation1: {
          boxShadow:
            '0 1px 3px rgba(0,0,0,0.06),' +
            ' 0 1px 2px rgba(0,0,0,0.04)',
        },
        elevation2: {
          boxShadow:
            '0 2px 6px rgba(0,0,0,0.07),' +
            ' 0 1px 3px rgba(0,0,0,0.05)',
        },
        elevation3: {
          boxShadow:
            '0 4px 12px rgba(0,0,0,0.08),' +
            ' 0 2px 4px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #f0f3f5',
          padding: '10px 16px',
        },
        head: {
          fontWeight: 600,
          fontSize: '0.8125rem',
          color: '#5a6a7a',
          background: '#f8fafb',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 4, fontWeight: 500, fontSize: '0.75rem' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 6 },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: '1px solid #edf0f3' },
      },
    },
  },
});

function App() {
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <MyRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default App;
