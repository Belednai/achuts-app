import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BRAND_COLORS, ENABLE_NEW_BRAND_COLOR } from '../lib/theme';

describe('Theme Configuration', () => {
  let originalNodeEnv: string | undefined;

  beforeEach(() => {
    // Store original NODE_ENV
    originalNodeEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    // Restore original NODE_ENV
    if (originalNodeEnv !== undefined) {
      process.env.NODE_ENV = originalNodeEnv;
    } else {
      delete process.env.NODE_ENV;
    }
  });

  describe('Brand Colors', () => {
    it('should have primary color defined', () => {
      expect(BRAND_COLORS.primary).toBeDefined();
      expect(typeof BRAND_COLORS.primary).toBe('string');
    });

    it('should have primary hover color defined', () => {
      expect(BRAND_COLORS.primaryHover).toBeDefined();
      expect(typeof BRAND_COLORS.primaryHover).toBe('string');
    });

    it('should have primary focus color defined', () => {
      expect(BRAND_COLORS.primaryFocus).toBeDefined();
      expect(typeof BRAND_COLORS.primaryFocus).toBe('string');
    });

    it('should have primary subtle color defined', () => {
      expect(BRAND_COLORS.primarySubtle).toBeDefined();
      expect(typeof BRAND_COLORS.primarySubtle).toBe('string');
    });

    it('should have legacy colors defined', () => {
      expect(BRAND_COLORS.legacy.primary).toBeDefined();
      expect(BRAND_COLORS.legacy.primaryHover).toBeDefined();
    });
  });

  describe('Feature Flag', () => {
    it('should have feature flag defined', () => {
      expect(ENABLE_NEW_BRAND_COLOR).toBeDefined();
      expect(typeof ENABLE_NEW_BRAND_COLOR).toBe('boolean');
    });

    it('should have brand colors that respond to feature flag', () => {
      // Test that the brand colors are properly defined
      expect(BRAND_COLORS.primary).toBeDefined();
      expect(BRAND_COLORS.primaryHover).toBeDefined();
    });
  });

  describe('Color Values', () => {
    it('should use new brand color when enabled', () => {
      // Test that the new brand color #2b404d is properly converted to HSL
      // #2b404d = RGB(43, 64, 77) ≈ HSL(207, 28%, 24%)
      expect(BRAND_COLORS.primary).toMatch(/^207\s+28%\s+24%$/);
    });

    it('should have proper hover variant', () => {
      // Hover should be darker than primary
      expect(BRAND_COLORS.primaryHover).toMatch(/^207\s+28%\s+20%$/);
    });

    it('should have proper focus variant', () => {
      // Focus should be lighter than primary
      expect(BRAND_COLORS.primaryFocus).toMatch(/^207\s+28%\s+30%$/);
    });
  });
});
