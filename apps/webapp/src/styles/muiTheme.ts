import { createTheme, ThemeOptions } from '@libs/mui';

/* export const paletteColorsDark = {
  primary: '#0f4c75',
  secondary: '#3282b8',
  error: '#E44C65',
  background: '#1b262c',
  text: '#bbe1fa',
};

export const paletteColorsLight = {
  primary: '#6886c5',
  secondary: '#ffe0ac',
  error: '#E44C65',
  background: '#f9f9f9',
  text: '#050505',
}; */

export const paletteColorsDark = {
  type: 'dark',
  primary: {
    main: '#038709',
  },
  secondary: {
    main: '#a74ef7',
  },
};

export const paletteColorsLight = {
  type: 'light',
  primary: {
    main: '#038709',
  },
  secondary: {
    main: '#7c1def',
  },
};
const options = (dark: boolean): ThemeOptions => {
  const paletteColors = dark ? paletteColorsDark : paletteColorsLight;
  return {
    palette: {
      mode: dark ? 'dark' : 'light',
      primary: {
        main: paletteColors.primary.main,
      },
      secondary: {
        main: paletteColors.secondary.main,
      },

      // ...
    },
    components: {
      MuiAppBar: {
        // Name of the rule
        styleOverrides: {
          root: {
            // Some CSS
            background: `linear-gradient(45deg, ${paletteColors.primary.main} 30%, ${paletteColors.secondary.main} 90%)`,
            //borderRadius: 3,
            //border: 0,
            //color: 'white'
            //height: 48,
            //padding: '0 30px',
            //boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          subtitle1: {
            opacity: 0.9,
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          marginNormal: {
            marginTop: 0,
          },
        },
      },
    },
  };
};
export const darkTheme = createTheme(options(true));
export const lightTheme = createTheme(options(false));
