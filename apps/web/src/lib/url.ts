/**
 * Validates that a path is a safe local redirect target.
 * Rejects protocol-relative, absolute URLs, and dangerous characters.
 */
export const SAFE_PATH_RE = /^\/(?!\/)[A-Za-z0-9/_\-?=&%#.]*$/;
