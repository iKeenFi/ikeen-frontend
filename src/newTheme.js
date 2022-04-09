//Your theme for the new stuff using material UI has been copied here so it doesn't conflict
import { createTheme } from '@material-ui/core/styles';

const newTheme = createTheme({
  palette: {
    type: 'light',
    text: {
      primary: '#dddfee',
      secondary: 'white',
    },
    background: {
      default: '#121212',
      paper: '#171923',
    },
    primary: {
      light: '#ffe066',
      main: '#2c2560',
      dark: '#5e00b3',
      contrastText: '#000',
    },
    secondary: {
      light: '#00bbf2',
      main: '#00bbf2',
      dark: '#054db2',
      contrastText: '#fff',
    },
    action: {
      disabledBackground: '#CDCDCD',
      active: '#000',
      hover: '#fff',
    },
  },
  typography: {
    color: '#2c2560',
    fontFamily: ['"Rubik"', 'sans-serif'].join(','),
  },
});

export default newTheme;
