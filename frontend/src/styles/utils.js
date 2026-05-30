import { THEME_COLORS, THEME_SPACING, THEME_SHADOWS, THEME_TRANSITIONS, THEME_LAYOUT } from './theme';

/**
 * Creates a consistent flex container style
 * @param {Object} options - Flex container options
 * @param {string} options.direction - flex-direction value
 * @param {string} options.justify - justify-content value
 * @param {string} options.align - align-items value
 * @param {string|number} options.gap - gap between items
 * @returns {Object} Style object
 */
export const createFlexStyle = ({
  direction = 'row',
  justify = 'flex-start',
  align = 'center',
  gap = THEME_SPACING.md,
  wrap = 'nowrap',
} = {}) => ({
  display: 'flex',
  flexDirection: direction,
  justifyContent: justify,
  alignItems: align,
  gap: typeof gap === 'string' ? gap : `${gap}px`,
  flexWrap: wrap,
});

/**
 * Creates a consistent card style
 * @param {Object} options - Card options
 * @param {string} options.elevation - shadow level
 * @param {string|number} options.padding - padding value
 * @param {string|number} options.borderRadius - border radius value
 * @returns {Object} Style object
 */
export const createCardStyle = ({
  elevation = 'md',
  padding = THEME_SPACING.lg,
  borderRadius = 12,
  backgroundColor = THEME_COLORS.background.paper,
} = {}) => ({
  backgroundColor,
  borderRadius: typeof borderRadius === 'string' ? borderRadius : `${borderRadius}px`,
  boxShadow: THEME_SHADOWS[elevation] || THEME_SHADOWS.md,
  padding: typeof padding === 'string' ? padding : `${padding}px`,
});

/**
 * Creates a consistent button style
 * @param {Object} options - Button options
 * @param {string} options.variant - button variant (primary, secondary, outlined, text)
 * @param {string} options.size - button size (small, medium, large)
 * @returns {Object} Style object
 */
export const createButtonStyle = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
} = {}) => {
  const baseStyle = {
    borderRadius: 8,
    fontWeight: 500,
    textTransform: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${THEME_TRANSITIONS.duration.short}ms ${THEME_TRANSITIONS.easing.easeInOut}`,
    border: 'none',
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME_SPACING.sm,
    opacity: disabled ? 0.6 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
  };

  const sizeStyles = {
    small: {
      padding: '8px 16px',
      fontSize: '0.875rem',
      minHeight: 36,
    },
    medium: {
      padding: '12px 24px',
      fontSize: '1rem',
      minHeight: 40,
    },
    large: {
      padding: '16px 32px',
      fontSize: '1.125rem',
      minHeight: 48,
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: THEME_COLORS.primary.main,
      color: THEME_COLORS.primary.contrastText,
      boxShadow: THEME_SHADOWS.sm,
      '&:hover': {
        backgroundColor: THEME_COLORS.primary.dark,
        boxShadow: THEME_SHADOWS.md,
      },
    },
    secondary: {
      backgroundColor: THEME_COLORS.secondary.main,
      color: THEME_COLORS.secondary.contrastText,
      boxShadow: THEME_SHADOWS.sm,
      '&:hover': {
        backgroundColor: THEME_COLORS.secondary.dark,
        boxShadow: THEME_SHADOWS.md,
      },
    },
    outlined: {
      backgroundColor: 'transparent',
      color: THEME_COLORS.primary.main,
      border: `1px solid ${THEME_COLORS.primary.main}`,
      '&:hover': {
        backgroundColor: 'rgba(219, 55, 37, 0.1)',
        borderColor: THEME_COLORS.primary.dark,
      },
    },
    text: {
      backgroundColor: 'transparent',
      color: THEME_COLORS.primary.main,
      boxShadow: 'none',
      '&:hover': {
        backgroundColor: 'rgba(219, 55, 37, 0.1)',
      },
    },
  };

  return {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };
};

/**
 * Creates a consistent input style
 * @param {Object} options - Input options
 * @param {boolean} options.error - whether input has error
 * @param {boolean} options.disabled - whether input is disabled
 * @returns {Object} Style object
 */
export const createInputStyle = ({
  error = false,
  disabled = false,
} = {}) => ({
  width: '100%',
  padding: '12px 16px',
  border: `1px solid ${error ? THEME_COLORS.error.main : THEME_COLORS.divider}`,
  borderRadius: 8,
  fontSize: '1rem',
  backgroundColor: disabled ? THEME_COLORS.background.dark : THEME_COLORS.background.paper,
  color: disabled ? THEME_COLORS.text.disabled : THEME_COLORS.text.primary,
  cursor: disabled ? 'not-allowed' : 'text',
  transition: `all ${THEME_TRANSITIONS.duration.shorter}ms ${THEME_TRANSITIONS.easing.easeInOut}`,
  '&:focus': {
    outline: 'none',
    borderColor: error ? THEME_COLORS.error.main : THEME_COLORS.primary.main,
    boxShadow: `0 0 0 2px ${error ? 'rgba(244, 67, 54, 0.2)' : 'rgba(219, 55, 37, 0.2)'}`,
  },
  '&::placeholder': {
    color: THEME_COLORS.text.disabled,
  },
});

/**
 * Creates a consistent container style
 * @param {Object} options - Container options
 * @param {string} options.maxWidth - max width value
 * @param {string|number} options.padding - padding value
 * @returns {Object} Style object
 */
export const createContainerStyle = ({
  maxWidth = '1200px',
  padding = THEME_SPACING.lg,
  margin = '0 auto',
} = {}) => ({
  maxWidth,
  padding: typeof padding === 'string' ? padding : `${padding}px`,
  margin,
  width: '100%',
});

/**
 * Creates a consistent grid style
 * @param {Object} options - Grid options
 * @param {string|number} options.columns - number of columns
 * @param {string|number} options.gap - gap between grid items
 * @returns {Object} Style object
 */
export const createGridStyle = ({
  columns = 'auto',
  gap = THEME_SPACING.md,
  minItemWidth = '200px',
} = {}) => ({
  display: 'grid',
  gridTemplateColumns: typeof columns === 'number' 
    ? `repeat(${columns}, 1fr)` 
    : `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
  gap: typeof gap === 'string' ? gap : `${gap}px`,
});

/**
 * Creates a consistent typography style
 * @param {Object} options - Typography options
 * @param {string} options.variant - typography variant
 * @param {string} options.color - text color
 * @param {string} options.align - text alignment
 * @returns {Object} Style object
 */
export const createTypographyStyle = ({
  variant = 'body1',
  color = THEME_COLORS.text.primary,
  align = 'left',
  weight = 'normal',
} = {}) => {
  const variantStyles = {
    h1: { fontSize: '2.5rem', fontWeight: 300, lineHeight: 1.2 },
    h2: { fontSize: '2rem', fontWeight: 300, lineHeight: 1.2 },
    h3: { fontSize: '1.75rem', fontWeight: 400, lineHeight: 1.167 },
    h4: { fontSize: '1.5rem', fontWeight: 400, lineHeight: 1.235 },
    h5: { fontSize: '1.25rem', fontWeight: 400, lineHeight: 1.334 },
    h6: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.6 },
    subtitle1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.75 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.57 },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.43 },
    caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.66 },
  };

  return {
    ...variantStyles[variant],
    color,
    textAlign: align,
    fontWeight: weight !== 'normal' ? weight : variantStyles[variant].fontWeight,
    margin: 0,
    padding: 0,
  };
};

/**
 * Creates responsive styles for different screen sizes
 * @param {Object} styles - Styles object with breakpoint keys
 * @returns {Object} Media query styles
 */
export const createResponsiveStyles = (styles) => {
  const breakpoints = {
    xs: '(max-width: 599px)',
    sm: '(min-width: 600px)',
    md: '(min-width: 960px)',
    lg: '(min-width: 1280px)',
    xl: '(min-width: 1920px)',
  };

  const responsiveStyles = {};
  
  Object.entries(styles).forEach(([breakpoint, style]) => {
    if (breakpoints[breakpoint]) {
      responsiveStyles[`@media ${breakpoints[breakpoint]}`] = style;
    }
  });

  return responsiveStyles;
};

/**
 * Creates auth-form styled container (similar to Login/SignUp)
 * @param {Object} options - Container options
 * @param {string|number} options.maxWidth - max width value
 * @param {boolean} options.hasHeader - whether to include header styling
 * @returns {Object} Style object
 */
export const createAuthContainerStyle = ({
  maxWidth = '480px',
  hasHeader = true,
  centerContent = true,
} = {}) => ({
  width: '100%',
  maxWidth,
  margin: centerContent ? '0 auto' : '0',
  padding: 16,
  
  // Container inner styling
  '& .auth-container': {
    background: THEME_COLORS.background.paper,
    borderRadius: 16,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    position: 'relative',
    
    // Top accent border
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: `linear-gradient(90deg, ${THEME_COLORS.primary.main}, ${THEME_COLORS.primary.dark}, ${THEME_COLORS.primary.main})`,
    },
  },
  
  // Header styling
  '& .auth-header': hasHeader ? {
    textAlign: 'center',
    padding: '40px 32px 24px',
    background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
    
    '& .auth-logo': {
      marginBottom: 24,
      
      '& img': {
        width: 80,
        height: 80,
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid white',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    },
    
    '& .auth-title': {
      fontSize: '2rem',
      fontWeight: 700,
      color: THEME_COLORS.text.primary,
      marginBottom: 8,
      margin: 0,
    },
    
    '& .auth-subtitle': {
      fontSize: '1rem',
      color: THEME_COLORS.text.secondary,
      margin: 0,
    },
  } : {},
  
  // Content area
  '& .auth-content': {
    padding: 32,
  },
  
  // Responsive styles
  '@media (max-width: 768px)': {
    maxWidth: '100%',
    padding: 12,
    
    '& .auth-container': {
      borderRadius: 12,
    },
    
    '& .auth-header': {
      padding: '32px 24px 20px',
      
      '& .auth-title': {
        fontSize: '1.75rem',
      },
      
      '& .auth-logo img': {
        width: 64,
        height: 64,
      },
    },
    
    '& .auth-content': {
      padding: 24,
    },
  },
  
  '@media (max-width: 480px)': {
    padding: 8,
    
    '& .auth-header': {
      padding: '24px 16px 16px',
      
      '& .auth-title': {
        fontSize: '1.5rem',
      },
    },
    
    '& .auth-content': {
      padding: 20,
    },
  },
});

/**
 * Creates auth-form styled input field
 * @param {Object} options - Input field options
 * @param {boolean} options.hasIcon - whether input has an icon
 * @param {boolean} options.error - whether input has error state
 * @param {boolean} options.disabled - whether input is disabled
 * @returns {Object} Style object
 */
export const createAuthInputStyle = ({
  hasIcon = true,
  error = false,
  disabled = false,
} = {}) => ({
  // Field group container
  '& .auth-field-group': {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 20,
  },
  
  // Label styling
  '& .auth-label': {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: THEME_COLORS.text.primary,
    marginBottom: 8,
    display: 'block',
  },
  
  // Input container
  '& .auth-input-container': {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  
  // Icon styling
  '& .auth-input-icon': hasIcon ? {
    position: 'absolute',
    left: 16,
    zIndex: 1,
    color: THEME_COLORS.text.disabled,
    pointerEvents: 'none',
  } : {},
  
  // Input field
  '& .auth-input': {
    width: '100%',
    padding: hasIcon ? '16px 16px 16px 48px' : '16px',
    border: `2px solid ${error ? THEME_COLORS.error.main : THEME_COLORS.divider}`,
    borderRadius: 12,
    fontSize: '1rem',
    backgroundColor: disabled ? THEME_COLORS.background.dark : THEME_COLORS.background.paper,
    color: disabled ? THEME_COLORS.text.disabled : THEME_COLORS.text.primary,
    transition: `all ${THEME_TRANSITIONS.duration.shorter}ms ${THEME_TRANSITIONS.easing.easeInOut}`,
    boxSizing: 'border-box',
    cursor: disabled ? 'not-allowed' : 'text',
    
    '&:focus': {
      outline: 'none',
      borderColor: error ? THEME_COLORS.error.main : THEME_COLORS.primary.main,
      boxShadow: error 
        ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
        : '0 0 0 3px rgba(219, 55, 37, 0.1)',
    },
    
    '&::placeholder': {
      color: THEME_COLORS.text.disabled,
    },
  },
  
  // Error text
  '& .auth-error-text': {
    color: THEME_COLORS.error.main,
    fontSize: '0.875rem',
    marginTop: 4,
    marginBottom: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  
  // Toggle button (for password fields)
  '& .auth-toggle-btn': {
    position: 'absolute',
    right: 16,
    zIndex: 1,
    background: 'none',
    border: 'none',
    color: THEME_COLORS.text.disabled,
    cursor: 'pointer',
    padding: 4,
    borderRadius: 4,
    transition: `color ${THEME_TRANSITIONS.duration.shorter}ms ${THEME_TRANSITIONS.easing.easeInOut}`,
    
    '&:hover': {
      color: THEME_COLORS.text.secondary,
    },
    
    '&:focus': {
      outline: 'none',
      color: THEME_COLORS.primary.main,
    },
  },
});

/**
 * Creates auth-form styled button
 * @param {Object} options - Button options
 * @param {string} options.variant - button variant (primary, secondary, phoenix)
 * @param {boolean} options.loading - whether button is in loading state
 * @param {boolean} options.disabled - whether button is disabled
 * @returns {Object} Style object
 */
export const createAuthButtonStyle = ({
  variant = 'primary',
  loading = false,
  disabled = false,
} = {}) => {
  const baseStyle = {
    width: '100%',
    padding: '16px 24px',
    border: 'none',
    borderRadius: 12,
    fontSize: '1rem',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${THEME_TRANSITIONS.duration.shorter}ms ${THEME_TRANSITIONS.easing.easeInOut}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    position: 'relative',
    overflow: 'hidden',
    opacity: disabled ? 0.7 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    
    // Shine effect
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
      transition: `left ${THEME_TRANSITIONS.duration.complex}ms ${THEME_TRANSITIONS.easing.easeInOut}`,
    },
    
    '&:hover::before': !disabled ? {
      left: '100%',
    } : {},
    
    '&:hover': !disabled ? {
      transform: 'translateY(-2px)',
    } : {},
    
    '&:active': !disabled ? {
      transform: 'translateY(0)',
    } : {},
  };

  const variantStyles = {
    primary: {
      background: `linear-gradient(135deg, ${THEME_COLORS.primary.main}, ${THEME_COLORS.primary.dark})`,
      color: THEME_COLORS.primary.contrastText,
      
      '&:hover': !disabled ? {
        boxShadow: `0 8px 25px rgba(219, 55, 37, 0.3)`,
      } : {},
    },
    secondary: {
      background: 'transparent',
      color: THEME_COLORS.primary.main,
      border: `2px solid ${THEME_COLORS.primary.main}`,
      
      '&:hover': !disabled ? {
        backgroundColor: 'rgba(219, 55, 37, 0.1)',
      } : {},
    },
    phoenix: {
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      color: THEME_COLORS.primary.contrastText,
      
      '&:hover': !disabled ? {
        boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)',
      } : {},
    },
  };

  return {
    ...baseStyle,
    ...variantStyles[variant],
    
    // Loading spinner
    '& .auth-spinner': loading ? {
      width: 20,
      height: 20,
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    } : {},
  };
};

/**
 * Creates auth-form styled tabs
 * @param {Object} options - Tabs options
 * @param {number} options.activeTab - active tab index
 * @returns {Object} Style object
 */
export const createAuthTabsStyle = ({
  activeTab = 0,
} = {}) => ({
  '& .auth-tabs': {
    display: 'flex',
    background: THEME_COLORS.background.dark,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    position: 'relative',
  },
  
  '& .auth-tab': {
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    background: 'transparent',
    borderRadius: 8,
    fontSize: '0.875rem',
    fontWeight: 500,
    color: THEME_COLORS.text.secondary,
    cursor: 'pointer',
    transition: `all ${THEME_TRANSITIONS.duration.shorter}ms ${THEME_TRANSITIONS.easing.easeInOut}`,
    position: 'relative',
    zIndex: 1,
    
    '&:hover:not(.auth-tab--active)': {
      color: THEME_COLORS.text.primary,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
  },
  
  '& .auth-tab--active': {
    color: THEME_COLORS.primary.main,
    backgroundColor: THEME_COLORS.background.paper,
    boxShadow: THEME_SHADOWS.sm,
  },
});

/**
 * Creates auth-form styled alert/notification
 * @param {Object} options - Alert options
 * @param {string} options.type - alert type (success, error, warning, info)
 * @returns {Object} Style object
 */
export const createAuthAlertStyle = ({
  type = 'info',
} = {}) => {
  const alertStyles = {
    success: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      borderColor: '#bbf7d0',
    },
    error: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      borderColor: '#fecaca',
    },
    warning: {
      backgroundColor: '#fef3c7',
      color: '#d97706',
      borderColor: '#fde68a',
    },
    info: {
      backgroundColor: '#dbeafe',
      color: '#1d4ed8',
      borderColor: '#bfdbfe',
    },
  };

  return {
    '& .auth-alert': {
      padding: '12px 16px',
      borderRadius: 8,
      fontSize: '0.875rem',
      marginBottom: 24,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      border: '1px solid',
      ...alertStyles[type],
    },
  };
};

/**
 * Creates auth-form styled divider
 * @param {Object} options - Divider options
 * @param {string} options.text - divider text
 * @returns {Object} Style object
 */
export const createAuthDividerStyle = ({
  text = 'OR',
} = {}) => ({
  '& .auth-divider': {
    position: 'relative',
    textAlign: 'center',
    margin: '24px 0',
    
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: THEME_COLORS.divider,
    },
    
    '& .auth-divider-text': {
      backgroundColor: THEME_COLORS.background.paper,
      padding: '0 16px',
      fontSize: '0.875rem',
      color: THEME_COLORS.text.secondary,
      fontWeight: 500,
    },
  },
});

/**
 * Creates auth-form styled footer
 * @param {Object} options - Footer options
 * @returns {Object} Style object
 */
export const createAuthFooterStyle = () => ({
  '& .auth-footer': {
    textAlign: 'center',
    marginTop: 24,
    paddingTop: 24,
    borderTop: `1px solid ${THEME_COLORS.divider}`,
    
    '& .auth-footer-text': {
      fontSize: '0.875rem',
      color: THEME_COLORS.text.secondary,
      margin: 0,
    },
    
    '& .auth-footer-link': {
      color: THEME_COLORS.primary.main,
      textDecoration: 'none',
      fontWeight: 500,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: `color ${THEME_TRANSITIONS.duration.shorter}ms ${THEME_TRANSITIONS.easing.easeInOut}`,
      
      '&:hover': {
        color: THEME_COLORS.primary.dark,
        textDecoration: 'underline',
      },
      
      '&:focus': {
        outline: 'none',
        color: THEME_COLORS.primary.dark,
      },
    },
  },
});

/**
 * Creates a complete auth-form layout (combines all auth utilities)
 * @param {Object} options - Layout options
 * @param {boolean} options.hasHeader - whether to include header
 * @param {boolean} options.hasTabs - whether to include tabs
 * @param {boolean} options.hasFooter - whether to include footer
 * @returns {Object} Style object
 */
export const createAuthLayoutStyle = ({
  hasHeader = true,
  hasTabs = false,
  hasFooter = true,
  maxWidth = '480px',
} = {}) => ({
  ...createAuthContainerStyle({ maxWidth, hasHeader }),
  ...createAuthInputStyle(),
  ...createAuthButtonStyle(),
  ...(hasTabs ? createAuthTabsStyle() : {}),
  ...createAuthAlertStyle({ type: 'success' }),
  ...createAuthDividerStyle(),
  ...(hasFooter ? createAuthFooterStyle() : {}),
  
  // Additional form styling
  '& .auth-form': {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  
  // Animation keyframes
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  
  // Accessibility and reduced motion support
  '@media (prefers-reduced-motion: reduce)': {
    '& .auth-input, & .auth-button, & .auth-tab': {
      transition: 'none',
    },
    
    '& .auth-button::before': {
      display: 'none',
    },
    
    '& .auth-spinner': {
      animation: 'none',
    },
  },
  
  // High contrast mode support
  '@media (prefers-contrast: high)': {
    '& .auth-input': {
      borderColor: '#000',
      
      '&:focus': {
        borderColor: '#000',
        boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.2)',
      },
    },
    
    '& .auth-button': {
      backgroundColor: '#000',
      color: '#fff',
    },
  },
});

/**
 * Creates consistent form validation styling
 * @param {Object} options - Validation options
 * @param {boolean} options.showValidation - whether to show validation states
 * @returns {Object} Style object
 */
export const createFormValidationStyle = ({
  showValidation = true,
} = {}) => ({
  '& .form-field': {
    position: 'relative',
    marginBottom: THEME_SPACING.md,
    
    '&.form-field--success': showValidation ? {
      '& .form-input': {
        borderColor: THEME_COLORS.success.main,
        
        '&:focus': {
          borderColor: THEME_COLORS.success.main,
          boxShadow: `0 0 0 3px rgba(76, 175, 80, 0.1)`,
        },
      },
      
      '& .form-validation-icon': {
        color: THEME_COLORS.success.main,
      },
    } : {},
    
    '&.form-field--error': showValidation ? {
      '& .form-input': {
        borderColor: THEME_COLORS.error.main,
        
        '&:focus': {
          borderColor: THEME_COLORS.error.main,
          boxShadow: `0 0 0 3px rgba(244, 67, 54, 0.1)`,
        },
      },
      
      '& .form-validation-icon': {
        color: THEME_COLORS.error.main,
      },
    } : {},
  },
  
  '& .form-validation-message': {
    display: 'flex',
    alignItems: 'center',
    gap: THEME_SPACING.xs,
    marginTop: THEME_SPACING.xs,
    fontSize: '0.875rem',
    
    '&.form-validation-message--error': {
      color: THEME_COLORS.error.main,
    },
    
    '&.form-validation-message--success': {
      color: THEME_COLORS.success.main,
    },
  },
});

/**
 * Creates loading state styling for components
 * @param {Object} options - Loading options
 * @param {string} options.size - loading spinner size (small, medium, large)
 * @returns {Object} Style object
 */
export const createLoadingStyle = ({
  size = 'medium',
} = {}) => {
  const sizes = {
    small: { width: 16, height: 16, borderWidth: 2 },
    medium: { width: 20, height: 20, borderWidth: 2 },
    large: { width: 24, height: 24, borderWidth: 3 },
  };

  return {
    '& .loading-spinner': {
      ...sizes[size],
      border: `${sizes[size].borderWidth}px solid rgba(255, 255, 255, 0.3)`,
      borderTop: `${sizes[size].borderWidth}px solid white`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    
    '& .loading-overlay': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'inherit',
      zIndex: 10,
    },
    
    '& .loading-text': {
      marginLeft: THEME_SPACING.sm,
      fontSize: '0.875rem',
      color: THEME_COLORS.text.secondary,
      fontWeight: 500,
    },
  };
};

/**
 * Creates modal/dialog styling similar to auth forms
 * @param {Object} options - Modal options
 * @param {string} options.size - modal size (small, medium, large)
 * @param {boolean} options.centered - whether modal is centered
 * @returns {Object} Style object
 */
export const createModalStyle = ({
  size = 'medium',
  centered = true,
} = {}) => {
  const sizes = {
    small: { maxWidth: '400px' },
    medium: { maxWidth: '500px' },
    large: { maxWidth: '800px' },
  };

  return {
    '& .modal-overlay': {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: centered ? 'center' : 'flex-start',
      justifyContent: 'center',
      padding: THEME_SPACING.lg,
      zIndex: 1300,
      animation: 'fadeIn 0.2s ease-out',
    },
    
    '& .modal-content': {
      backgroundColor: THEME_COLORS.background.paper,
      borderRadius: 16,
      boxShadow: THEME_SHADOWS.xxl,
      ...sizes[size],
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative',
      animation: 'slideIn 0.3s ease-out',
      
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: `linear-gradient(90deg, ${THEME_COLORS.primary.main}, ${THEME_COLORS.primary.dark}, ${THEME_COLORS.primary.main})`,
      },
    },
    
    '& .modal-header': {
      padding: '24px 32px',
      borderBottom: `1px solid ${THEME_COLORS.divider}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      
      '& .modal-title': {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: THEME_COLORS.text.primary,
        margin: 0,
      },
      
      '& .modal-close': {
        background: 'none',
        border: 'none',
        color: THEME_COLORS.text.secondary,
        cursor: 'pointer',
        padding: THEME_SPACING.sm,
        borderRadius: 4,
        transition: `color ${THEME_TRANSITIONS.duration.shorter}ms`,
        
        '&:hover': {
          color: THEME_COLORS.text.primary,
        },
      },
    },
    
    '& .modal-body': {
      padding: '24px 32px',
    },
    
    '& .modal-footer': {
      padding: '16px 32px 24px',
      borderTop: `1px solid ${THEME_COLORS.divider}`,
      display: 'flex',
      gap: THEME_SPACING.md,
      justifyContent: 'flex-end',
    },
    
    '@keyframes slideIn': {
      from: {
        opacity: 0,
        transform: 'translateY(-20px) scale(0.95)',
      },
      to: {
        opacity: 1,
        transform: 'translateY(0) scale(1)',
      },
    },
    
    '@media (max-width: 768px)': {
      '& .modal-content': {
        borderRadius: 12,
        margin: THEME_SPACING.md,
        ...sizes.small,
      },
      
      '& .modal-header, & .modal-body, & .modal-footer': {
        padding: `${THEME_SPACING.lg}px ${THEME_SPACING.md}px`,
      },
    },
  };
};

/**
 * Creates notification/toast styling
 * @param {Object} options - Notification options
 * @param {string} options.position - notification position (top, bottom, top-right, etc.)
 * @param {string} options.type - notification type (success, error, warning, info)
 * @returns {Object} Style object
 */
export const createNotificationStyle = ({
  position = 'top-right',
  type = 'info',
} = {}) => {
  const positions = {
    'top': { top: THEME_SPACING.lg, left: '50%', transform: 'translateX(-50%)' },
    'top-right': { top: THEME_SPACING.lg, right: THEME_SPACING.lg },
    'top-left': { top: THEME_SPACING.lg, left: THEME_SPACING.lg },
    'bottom': { bottom: THEME_SPACING.lg, left: '50%', transform: 'translateX(-50%)' },
    'bottom-right': { bottom: THEME_SPACING.lg, right: THEME_SPACING.lg },
    'bottom-left': { bottom: THEME_SPACING.lg, left: THEME_SPACING.lg },
  };

  const typeStyles = {
    success: {
      backgroundColor: THEME_COLORS.success.main,
      color: 'white',
    },
    error: {
      backgroundColor: THEME_COLORS.error.main,
      color: 'white',
    },
    warning: {
      backgroundColor: THEME_COLORS.warning.main,
      color: 'white',
    },
    info: {
      backgroundColor: THEME_COLORS.info.main,
      color: 'white',
    },
  };

  return {
    '& .notification-container': {
      position: 'fixed',
      ...positions[position],
      zIndex: 1400,
      display: 'flex',
      flexDirection: 'column',
      gap: THEME_SPACING.sm,
      pointerEvents: 'none',
    },
    
    '& .notification': {
      ...typeStyles[type],
      padding: '12px 16px',
      borderRadius: 8,
      boxShadow: THEME_SHADOWS.lg,
      display: 'flex',
      alignItems: 'center',
      gap: THEME_SPACING.sm,
      fontSize: '0.875rem',
      fontWeight: 500,
      minWidth: 300,
      maxWidth: 400,
      pointerEvents: 'auto',
      animation: 'slideInNotification 0.3s ease-out',
      
      '& .notification-icon': {
        flexShrink: 0,
      },
      
      '& .notification-content': {
        flex: 1,
      },
      
      '& .notification-close': {
        background: 'none',
        border: 'none',
        color: 'inherit',
        cursor: 'pointer',
        padding: 4,
        borderRadius: 4,
        opacity: 0.8,
        transition: `opacity ${THEME_TRANSITIONS.duration.shorter}ms`,
        
        '&:hover': {
          opacity: 1,
        },
      },
    },
    
    '@keyframes slideInNotification': {
      from: {
        opacity: 0,
        transform: 'translateX(100%)',
      },
      to: {
        opacity: 1,
        transform: 'translateX(0)',
      },
    },
    
    '@media (max-width: 768px)': {
      '& .notification-container': {
        left: THEME_SPACING.md,
        right: THEME_SPACING.md,
        top: THEME_SPACING.md,
        transform: 'none',
      },
      
      '& .notification': {
        minWidth: 'auto',
        maxWidth: 'none',
      },
    },
  };
};

/**
 * Creates sidebar/navigation styling similar to auth forms
 * @param {Object} options - Sidebar options
 * @param {string} options.position - sidebar position (left, right)
 * @param {boolean} options.collapsed - whether sidebar is collapsed
 * @returns {Object} Style object
 */
export const createSidebarStyle = ({
  position = 'left',
  collapsed = false,
} = {}) => ({
  '& .sidebar': {
    position: 'fixed',
    top: 0,
    [position]: 0,
    height: '100vh',
    width: collapsed ? 80 : 280,
    backgroundColor: THEME_COLORS.background.paper,
    borderRight: position === 'left' ? `1px solid ${THEME_COLORS.divider}` : 'none',
    borderLeft: position === 'right' ? `1px solid ${THEME_COLORS.divider}` : 'none',
    boxShadow: THEME_SHADOWS.md,
    transition: `width ${THEME_TRANSITIONS.duration.standard}ms ${THEME_TRANSITIONS.easing.easeInOut}`,
    zIndex: 1200,
    overflow: 'hidden',
    
    '& .sidebar-header': {
      padding: THEME_SPACING.lg,
      borderBottom: `1px solid ${THEME_COLORS.divider}`,
      display: 'flex',
      alignItems: 'center',
      gap: THEME_SPACING.md,
      
      '& .sidebar-logo': {
        width: 40,
        height: 40,
        borderRadius: '50%',
        flexShrink: 0,
      },
      
      '& .sidebar-title': {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: THEME_COLORS.text.primary,
        margin: 0,
        opacity: collapsed ? 0 : 1,
        transition: `opacity ${THEME_TRANSITIONS.duration.shorter}ms`,
      },
    },
    
    '& .sidebar-content': {
      padding: THEME_SPACING.md,
      height: 'calc(100vh - 80px)',
      overflow: 'auto',
    },
    
    '& .sidebar-nav': {
      display: 'flex',
      flexDirection: 'column',
      gap: THEME_SPACING.xs,
    },
    
    '& .sidebar-nav-item': {
      display: 'flex',
      alignItems: 'center',
      gap: THEME_SPACING.md,
      padding: '12px 16px',
      borderRadius: 8,
      color: THEME_COLORS.text.secondary,
      textDecoration: 'none',
      fontSize: '0.875rem',
      fontWeight: 500,
      transition: `all ${THEME_TRANSITIONS.duration.shorter}ms`,
      
      '&:hover': {
        backgroundColor: 'rgba(219, 55, 37, 0.1)',
        color: THEME_COLORS.primary.main,
      },
      
      '&.sidebar-nav-item--active': {
        backgroundColor: THEME_COLORS.primary.main,
        color: THEME_COLORS.primary.contrastText,
      },
      
      '& .sidebar-nav-icon': {
        flexShrink: 0,
        width: 20,
        height: 20,
      },
      
      '& .sidebar-nav-text': {
        opacity: collapsed ? 0 : 1,
        transition: `opacity ${THEME_TRANSITIONS.duration.shorter}ms`,
      },
    },
  },
  
  '& .sidebar-toggle': {
    position: 'fixed',
    top: THEME_SPACING.lg,
    [position]: collapsed ? 90 : 290,
    zIndex: 1201,
    width: 32,
    height: 32,
    backgroundColor: THEME_COLORS.background.paper,
    border: `1px solid ${THEME_COLORS.divider}`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: `${position} ${THEME_TRANSITIONS.duration.standard}ms ${THEME_TRANSITIONS.easing.easeInOut}`,
    boxShadow: THEME_SHADOWS.sm,
    
    '&:hover': {
      backgroundColor: THEME_COLORS.background.dark,
    },
  },
  
  '@media (max-width: 768px)': {
    '& .sidebar': {
      transform: collapsed ? 'translateX(-100%)' : 'translateX(0)',
      width: 280,
    },
    
    '& .sidebar-toggle': {
      [position]: THEME_SPACING.lg,
    },
  },
});

/**
 * Creates a consistent layout container style
 * @param {Object} options - Layout container options
 * @param {string} options.maxWidth - Maximum width (narrow, default, wide, full)
 * @param {string} options.padding - Padding size (xs, sm, md, lg, xl)
 * @param {boolean} options.centered - Whether to center the container
 * @returns {Object} Style object
 */
export const createLayoutContainerStyle = ({
  maxWidth = 'default',
  padding = 'md',
  centered = true,
} = {}) => ({
  maxWidth: THEME_LAYOUT.maxWidth[maxWidth] || THEME_LAYOUT.maxWidth.default,
  width: '100%',
  margin: centered ? '0 auto' : '0',
  padding: `0 ${THEME_LAYOUT.padding[padding] || THEME_LAYOUT.padding.md}`,
});

/**
 * Creates a consistent page wrapper style
 * @param {Object} options - Page wrapper options
 * @param {string} options.padding - Padding size (xs, sm, md, lg, xl)
 * @param {string} options.background - Background color
 * @param {boolean} options.fullHeight - Whether to use full viewport height
 * @returns {Object} Style object
 */
export const createPageWrapperStyle = ({
  padding = 'md',
  background = THEME_COLORS.background.default,
  fullHeight = true,
} = {}) => ({
  minHeight: fullHeight ? `calc(100vh - ${THEME_LAYOUT.navbar.height})` : 'auto',
  padding: THEME_LAYOUT.padding[padding] || THEME_LAYOUT.padding.md,
  background,
});

/**
 * Creates a consistent grid layout style
 * @param {Object} options - Grid layout options
 * @param {string|number} options.columns - Number of columns or template
 * @param {string} options.gap - Gap size (xs, sm, md, lg, xl)
 * @param {string} options.alignItems - Align items value
 * @returns {Object} Style object
 */
export const createGridLayoutStyle = ({
  columns = 1,
  gap = 'md',
  alignItems = 'start',
} = {}) => {
  let gridTemplateColumns;
  
  if (typeof columns === 'number') {
    gridTemplateColumns = `repeat(${columns}, 1fr)`;
  } else if (columns === 'auto') {
    gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
  } else if (columns === 'sidebar') {
    gridTemplateColumns = '300px 1fr';
  } else {
    gridTemplateColumns = columns;
  }
  
  return {
    display: 'grid',
    gridTemplateColumns,
    gap: THEME_LAYOUT.gap[gap] || THEME_LAYOUT.gap.md,
    alignItems,
  };
};
