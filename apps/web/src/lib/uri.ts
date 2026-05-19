const ALLOWED_URI_SCHEMES = ["http:", "https:", "mailto:"];

/**
 * Returns true for URIs that are safe to use as href values in rendered content.
 * Blocks protocol-relative, javascript:, data:, vbscript:, file://, etc.
 */
export function isSafeUri(uri: string): boolean {
  if (uri.startsWith("//")) return false;
  if (uri.startsWith("/") || uri.startsWith("#") || uri.startsWith("?")) {
    return true;
  }
  try {
    const { protocol } = new URL(uri);
    return ALLOWED_URI_SCHEMES.includes(protocol);
  } catch {
    return false;
  }
}
