/* global WebImporter */

/**
 * Parser for hero-openreach block
 *
 * Source: https://www.openreach.com/
 * Base Block: hero
 *
 * Block Structure:
 * - Row 1: Background image (optional)
 * - Row 2: Content (heading, description, CTA)
 *
 * Source HTML Pattern:
 * <div class="hero-banner-right">
 *   <img src="..." alt="...">
 *   <h1>Heading</h1>
 *   <p>Description</p>
 *   <a href="...">CTA</a>
 * </div>
 *
 * Generated: 2026-01-07
 */
export default function parse(element, { document }) {
  // Extract background/hero image
  const heroImage = element.querySelector('img[src*="hero"], img[alt*="gamer"], picture img');

  // Extract heading - look for h1 or h2 with heading content
  const heading = element.querySelector('h1, h2, [class*="title"]');

  // Extract description/subheading
  const description = element.querySelector('p, [class*="description"], [class*="subtitle"]');

  // Extract CTA buttons/links
  const ctaLinks = Array.from(element.querySelectorAll('a.cta-primary, a.btn, a[class*="cta"], button'));

  // Build cells array
  const cells = [];

  // Row 1: Background image (if present)
  if (heroImage) {
    cells.push([heroImage.cloneNode(true)]);
  }

  // Row 2: Content (heading, description, CTAs)
  const contentCell = [];
  if (heading) contentCell.push(heading.cloneNode(true));
  if (description) contentCell.push(description.cloneNode(true));
  ctaLinks.forEach(cta => contentCell.push(cta.cloneNode(true)));

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Openreach', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
