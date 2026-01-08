/* global WebImporter */

/**
 * Parser for cards-openreach block
 *
 * Source: https://www.openreach.com/
 * Base Block: cards
 *
 * Block Structure:
 * - Each card is 1 row with 2 columns: [image | heading, text, CTA]
 *
 * Source HTML Pattern:
 * <div class="box-border-green">
 *   <img src="..." alt="...">
 *   <h3>Title</h3>
 *   <p>Description</p>
 *   <a href="...">CTA</a>
 * </div>
 *
 * Generated: 2026-01-07
 */
export default function parse(element, { document }) {
  // Find all card containers
  const cardContainers = element.querySelectorAll('.box-border-green, .box-tappable, [class*="card"]');

  // If no card containers found, treat the element itself as a single card
  const cards = cardContainers.length > 0 ? Array.from(cardContainers) : [element];

  // Build cells array - one row per card
  const cells = [];

  cards.forEach(card => {
    // Extract card image
    const image = card.querySelector('img, picture img');

    // Extract card heading
    const heading = card.querySelector('h2, h3, h4, [class*="title"]');

    // Extract card description
    const description = card.querySelector('p, [class*="description"], [class*="text"]');

    // Extract CTA link
    const cta = card.querySelector('a.cta-secondary, a.cta-primary, a[class*="cta"], a[href]');

    // Build row: [image | content]
    const imageCell = image ? [image.cloneNode(true)] : [''];

    const contentCell = [];
    if (heading) contentCell.push(heading.cloneNode(true));
    if (description) contentCell.push(description.cloneNode(true));
    if (cta) contentCell.push(cta.cloneNode(true));

    if (contentCell.length > 0 || image) {
      cells.push([imageCell, contentCell]);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Openreach', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
