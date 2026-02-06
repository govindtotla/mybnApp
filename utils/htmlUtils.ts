// utils/htmlUtils.ts
export const decodeHtmlEntities = (text: string): string => {
  if (!text) return '';

  return text
    // Replace common HTML entities
    .replace(/&nbsp;/g, '\u00A0')       // Non-breaking space
    .replace(/&amp;/g, '&')             // Ampersand
    .replace(/&lt;/g, '<')              // Less than
    .replace(/&gt;/g, '>')              // Greater than
    .replace(/&quot;/g, '"')            // Double quote
    .replace(/&#39;/g, "'")             // Single quote
    .replace(/&ldquo;/g, '"')           // Left double quote
    .replace(/&rdquo;/g, '"')           // Right double quote
    .replace(/&lsquo;/g, "'")           // Left single quote
    .replace(/&rsquo;/g, "'")           // Right single quote
    .replace(/&mdash;/g, '—')           // Em dash
    .replace(/&ndash;/g, '–')           // En dash
    .replace(/&hellip;/g, '…')          // Ellipsis
    .replace(/&copy;/g, '©')            // Copyright
    .replace(/&reg;/g, '®')             // Registered trademark
    .replace(/&trade;/g, '™')           // Trademark
    .replace(/&euro;/g, '€')            // Euro
    .replace(/&pound;/g, '£')           // Pound
    .replace(/&yen;/g, '¥')             // Yen
    .replace(/&cent;/g, '¢')            // Cent
    .replace(/&#xA0;/g, '\u00A0')       // Non-breaking space (hex)
    .replace(/&#160;/g, '\u00A0')       // Non-breaking space (decimal)
    .replace(/&#38;/g, '&')             // Ampersand (decimal)
    .replace(/&#60;/g, '<')             // Less than (decimal)
    .replace(/&#62;/g, '>')             // Greater than (decimal)
    // Add more entities as needed
    .trim();
};