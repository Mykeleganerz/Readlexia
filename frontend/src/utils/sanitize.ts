import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Use this before rendering any user-generated HTML content
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    // Allow basic formatting tags
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'],
    // Allow basic attributes
    ALLOWED_ATTR: ['class', 'id'],
    // Keep HTML structure
    KEEP_CONTENT: true,
    // Return safe HTML
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
  });
}

/**
 * Sanitizes HTML and returns as plain text (strips all HTML)
 * Use this for displaying user content in non-HTML contexts
 */
export function sanitizeToText(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true,
  });
}

/**
 * React component helper for safely displaying HTML
 */
export function createSafeHtml(dirty: string) {
  return {
    __html: sanitizeHtml(dirty),
  };
}
