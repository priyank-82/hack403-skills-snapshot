export const THEME_COLORS = {
  primary: {
    main: '#DB3725',
    light: '#E55A4A',
    dark: '#B82E1F',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#2196F3',
    light: '#42A5F5',
    dark: '#1976D2',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#F44336',
    light: '#EF5350',
    dark: '#C62828',
  },
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
  },
  info: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },
  background: {
    default: '#FAFAFA',
    paper: '#FFFFFF',
    dark: '#F5F5F5',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
  },
  divider: '#E0E0E0',
};

export const THEME_SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const THEME_BREAKPOINTS = {
  xs: '0px',
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px',
};

export const THEME_TYPOGRAPHY = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 300,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 300,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 400,
    lineHeight: 1.167,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 400,
    lineHeight: 1.235,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 400,
    lineHeight: 1.334,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.6,
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.75,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.57,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.43,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.75,
    textTransform: 'none',
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.66,
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 2.66,
    textTransform: 'uppercase',
  },
};

export const THEME_SHADOWS = {
  none: 'none',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

export const THEME_TRANSITIONS = {
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
};

export const THEME_LAYOUT = {
  maxWidth: {
    narrow: '800px',
    default: '1200px',
    wide: '1400px',
    full: '100%',
  },
  sidebar: {
    width: '240px',
    collapsedWidth: '64px',
  },
  navbar: {
    height: '64px',
    mobileHeight: '56px',
  },
  padding: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
  },
  gap: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
};

export const COMPONENT_STYLES = {
  navbar: {
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: THEME_SHADOWS.sm,
    zIndex: 1200,
  },
  sidebar: {
    width: 280,
    backgroundColor: THEME_COLORS.background.paper,
    borderRight: `1px solid ${THEME_COLORS.divider}`,
  },
  card: {
    borderRadius: 12,
    boxShadow: THEME_SHADOWS.md,
    backgroundColor: THEME_COLORS.background.paper,
  },
  button: {
    primary: {
      backgroundColor: THEME_COLORS.primary.main,
      color: THEME_COLORS.primary.contrastText,
      borderRadius: 8,
      padding: '12px 24px',
      fontWeight: 500,
      textTransform: 'none',
      boxShadow: THEME_SHADOWS.sm,
      '&:hover': {
        backgroundColor: THEME_COLORS.primary.dark,
        boxShadow: THEME_SHADOWS.md,
      },
    },
    secondary: {
      backgroundColor: 'transparent',
      color: THEME_COLORS.primary.main,
      border: `1px solid ${THEME_COLORS.primary.main}`,
      borderRadius: 8,
      padding: '12px 24px',
      fontWeight: 500,
      textTransform: 'none',
      '&:hover': {
        backgroundColor: 'rgba(219, 55, 37, 0.1)',
      },
    },
  },
};
