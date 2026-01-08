/* global WebImporter */

/**
 * Transformer for Openreach website cleanup
 * Purpose: Remove non-content elements and fix DOM issues
 * Applies to: www.openreach.com (all templates)
 * Generated: 2026-01-07
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow
 * - Page structure analysis from Openreach homepage
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform'
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent elements
    // EXTRACTED: Found OneTrust and Cookiebot elements in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.onetrust-pc-dark-filter',
      '[class*="cookie"]',
      '#CybotCookiebotDialog'
    ]);

    // Remove navigation header (handled separately)
    // EXTRACTED: Found header elements in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'header',
      '.experiencefragment.reference-header-snippet',
      '[class*="header-snippet"]'
    ]);

    // Remove footer (handled separately)
    // EXTRACTED: Found footer fragment in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'footer',
      '.experiencefragment.reference-footer-snippet',
      '.cmp-experiencefragment--footer'
    ]);

    // Remove reCAPTCHA elements
    // EXTRACTED: Found Google reCAPTCHA in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.grecaptcha-badge',
      '[class*="recaptcha"]'
    ]);

    // Re-enable scrolling if blocked
    if (element.style && element.style.overflow === 'hidden') {
      element.setAttribute('style', 'overflow: scroll;');
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove tracking and analytics elements
    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
      el.removeAttribute('onclick');
      el.removeAttribute('data-cmp-is');
    });

    // Remove remaining unwanted elements
    WebImporter.DOMUtils.remove(element, [
      'script',
      'noscript',
      'iframe:not([src*="trustpilot"])',
      'link',
      'style',
      'source'
    ]);

    // Remove empty dividers
    WebImporter.DOMUtils.remove(element, [
      '.divider:empty',
      '[class*="separator"]:empty'
    ]);
  }
}
