/**
 * Theme configuration for the application
 * Centralizes brand colors and provides state variants
 */

// Declare global variable injected by Vite
declare global {
  const __ENABLE_NEW_BRAND_COLOR__: string | undefined;
}

// Feature flag for new brand color
export const ENABLE_NEW_BRAND_COLOR = typeof __ENABLE_NEW_BRAND_COLOR__ !== 'undefined' 
  ? __ENABLE_NEW_BRAND_COLOR__ === 'true'
  : process.env.NODE_ENV === 'development';

// Brand color token - #2b404d converted to HSL
export const BRAND_COLORS = {
  // New brand color (HSL: 207, 28%, 24%)
  primary: ENABLE_NEW_BRAND_COLOR ? '207 28% 24%' : '217 91% 16%',
  // State variants derived from the new brand color
  primaryHover: ENABLE_NEW_BRAND_COLOR ? '207 28% 20%' : '217 91% 12%',
  primaryFocus: ENABLE_NEW_BRAND_COLOR ? '207 28% 30%' : '217 91% 20%',
  primarySubtle: ENABLE_NEW_BRAND_COLOR ? '207 28% 95%' : '217 91% 95%',
  // Legacy fallback (keeping existing palette intact)
  legacy: {
    primary: '217 91% 16%',
    primaryHover: '217 91% 12%',
  }
};

// Helper function to get current primary color
export const getPrimaryColor = () => BRAND_COLORS.primary;
export const getPrimaryHoverColor = () => BRAND_COLORS.primaryHover;
export const getPrimaryFocusColor = () => BRAND_COLORS.primaryFocus;
export const getPrimarySubtleColor = () => BRAND_COLORS.primarySubtle;

// Check if new brand color is enabled
export const isNewBrandColorEnabled = () => ENABLE_NEW_BRAND_COLOR;
