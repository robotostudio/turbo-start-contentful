import * as contentful from "contentful";

import { accessToken, previewToken, spaceId } from "../env";

export function getClient(preview = false) {
  const client = contentful.createClient({
    accessToken: preview ? previewToken || accessToken : accessToken,
    space: spaceId,
  });

  return client;
}

export function parseContentfulError(error: unknown): string {
  if (!error) {
    return "An unknown error occurred while fetching content";
  }

  // Handle non-Error objects
  if (typeof error !== "object") {
    return "An unexpected error occurred while fetching content";
  }

  const err = error as any;

  // Handle network errors
  if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
    return "Unable to connect to Contentful. Please check your internet connection";
  }

  // Handle timeout errors
  if (err.code === "ETIMEDOUT") {
    return "Request timed out while fetching content. Please try again";
  }

  // Handle Contentful API errors
  if (err.sys?.id) {
    switch (err.sys.id) {
      case "AccessTokenInvalid":
        return "Invalid access token. Please check your Contentful configuration";

      case "NotFound":
        return "The requested content was not found";

      case "RateLimitExceeded":
        return "Too many requests. Please wait a moment and try again";

      case "AccessDenied":
        return "Access denied. You don't have permission to view this content";

      case "ValidationFailed":
        return "Invalid request parameters";

      case "VersionMismatch":
        return "Content has been updated. Please refresh and try again";

      case "InvalidQuery":
        return "Invalid search query";

      default:
        return err.message || "An error occurred while fetching content";
    }
  }

  // Handle HTTP status codes
  if (err.response?.status) {
    switch (err.response.status) {
      case 400:
        return "Bad request. Please check your query parameters";

      case 401:
        return "Authentication failed. Please check your credentials";

      case 403:
        return "Access forbidden. You don't have permission to access this content";

      case 404:
        return "Content not found";

      case 422:
        return "Invalid request. Please check your data";

      case 429:
        return "Rate limit exceeded. Please wait before making more requests";

      case 500:
        return "Contentful server error. Please try again later";

      case 502:
      case 503:
      case 504:
        return "Contentful service is temporarily unavailable. Please try again later";

      default:
        return `Request failed with status ${err.response.status}`;
    }
  }

  // Handle generic Error objects
  if (err instanceof Error) {
    return err.message || "An error occurred while fetching content";
  }

  // Fallback for any other error types
  return "An unexpected error occurred while fetching content";
}
