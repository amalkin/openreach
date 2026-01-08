/* global WebImporter */

/**
 * Parser for columns-openreach block
 *
 * Source: https://www.openreach.com/
 * Base Block: columns
 *
 * Block Structure:
 * - 2-column: [image | content] or [content | image]
 * - 3-column: [col1 | col2 | col3]
 *
 * Source HTML Pattern (2 columns):
 * <div class="container">
 *   <div><img src="..."></div>
 *   <div><h2>...</h2><p>...</p><a>...</a></div>
 * </div>
 *
 * Source HTML Pattern (3 columns - stats):
 * <div class="container">
 *   <div><img><strong>26k</strong><p>...</p></div>
 *   <div><img><strong>70k</strong><p>...</p></div>
 *   <div><img><strong>98.3k</strong><p>...</p></div>
 * </div>
 *
 * Generated: 2026-01-07
 */
export default function parse(element, { document }) {
  // Try to find column containers
  const columnDivs = element.querySelectorAll(':scope > div > div, :scope > div');

  // Build cells array
  const cells = [];

  if (columnDivs.length >= 3) {
    // 3-column layout (like stats)
    const row = [];
    Array.from(columnDivs).slice(0, 3).forEach(col => {
      const colContent = [];

      // Extract icon/image
      const icon = col.querySelector('img, picture img');
      if (icon) colContent.push(icon.cloneNode(true));

      // Extract stat number (bold text)
      const stat = col.querySelector('strong, b, [class*="stat"], h2, h3');
      if (stat) colContent.push(stat.cloneNode(true));

      // Extract description
      const desc = col.querySelector('p, [class*="description"]');
      if (desc) colContent.push(desc.cloneNode(true));

      row.push(colContent);
    });
    cells.push(row);
  } else if (columnDivs.length === 2) {
    // 2-column layout (like news card)
    const leftDiv = columnDivs[0];
    const rightDiv = columnDivs[1];

    const leftContent = [];
    const rightContent = [];

    // Check which side has the image
    const leftImage = leftDiv.querySelector('img, picture img');
    const rightImage = rightDiv.querySelector('img, picture img');

    if (leftImage) {
      leftContent.push(leftImage.cloneNode(true));
    } else {
      // Extract text content from left
      const heading = leftDiv.querySelector('h1, h2, h3, [class*="title"]');
      const desc = leftDiv.querySelector('p, [class*="description"]');
      const cta = leftDiv.querySelector('a[href]');
      if (heading) leftContent.push(heading.cloneNode(true));
      if (desc) leftContent.push(desc.cloneNode(true));
      if (cta) leftContent.push(cta.cloneNode(true));
    }

    if (rightImage) {
      rightContent.push(rightImage.cloneNode(true));
    } else {
      // Extract text content from right
      const heading = rightDiv.querySelector('h1, h2, h3, [class*="title"]');
      const desc = rightDiv.querySelector('p, [class*="description"]');
      const cta = rightDiv.querySelector('a[href]');
      if (heading) rightContent.push(heading.cloneNode(true));
      if (desc) rightContent.push(desc.cloneNode(true));
      if (cta) rightContent.push(cta.cloneNode(true));
    }

    cells.push([leftContent, rightContent]);
  } else {
    // Fallback: treat as single column with all content
    const content = [];
    const allImages = element.querySelectorAll('img');
    const allHeadings = element.querySelectorAll('h1, h2, h3');
    const allParagraphs = element.querySelectorAll('p');
    const allLinks = element.querySelectorAll('a[href]');

    allImages.forEach(img => content.push(img.cloneNode(true)));
    allHeadings.forEach(h => content.push(h.cloneNode(true)));
    allParagraphs.forEach(p => content.push(p.cloneNode(true)));
    allLinks.forEach(a => content.push(a.cloneNode(true)));

    cells.push([content]);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Openreach', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
