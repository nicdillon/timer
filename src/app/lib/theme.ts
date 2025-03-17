import { createTheme } from '@mui/material/styles';

function getGlobalCSSVariable(variable: string, fallback: string): string {
  if (typeof window !== 'undefined') {
    const rootStyle = window.getComputedStyle(document.documentElement);
    return rootStyle.getPropertyValue(variable).trim() || fallback;
  }
  return fallback;
}

const backgroundDefault = getGlobalCSSVariable('--background', '#ffffff');
const textPrimary = getGlobalCSSVariable('--foreground', '#171717');
const paperBackground = getGlobalCSSVariable('--paper-background', '#ffffff');
const accent = getGlobalCSSVariable('--accent', '#3366ff')

const theme = createTheme({
    palette: {
        background: {
            default: backgroundDefault,
        },
        text: {
            primary: textPrimary,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none',
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    backgroundColor: backgroundDefault,
                    color: textPrimary,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: paperBackground,
                    color: textPrimary,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
              head: {
                // Define header cell styles for MUI tables
                backgroundColor: accent,
                color: textPrimary,
                fontWeight: 'bold',
              },
            },
          },
    },
});

export default theme;