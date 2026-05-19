import { describe, expect, it } from "vitest";

import { capitalize, getTitleCase, isRelativeUrl, isValidUrl } from "@/utils";

describe("capitalize", () => {
  it("returns empty string for empty input", () => {
    expect(capitalize("")).toBe("");
  });

  it("uppercases single character", () => {
    expect(capitalize("a")).toBe("A");
  });

  it("uppercases first char and leaves rest unchanged", () => {
    expect(capitalize("hello world")).toBe("Hello world");
  });

  it("does not alter already-uppercased strings", () => {
    expect(capitalize("Hello")).toBe("Hello");
  });
});

describe("getTitleCase", () => {
  it("converts camelCase to Title Case with spaces", () => {
    expect(getTitleCase("camelCase")).toBe("Camel Case");
  });

  it("handles multiple uppercase letters", () => {
    expect(getTitleCase("myVariableName")).toBe("My Variable Name");
  });

  it("handles already-capitalized first word (leading space is trimmed by caller)", () => {
    // getTitleCase inserts a space before each uppercase letter including the
    // first, so "CamelCase" → " Camel Case". Callers trim if needed.
    expect(getTitleCase("CamelCase")).toBe(" Camel Case");
  });
});

describe("isRelativeUrl", () => {
  it("returns true for paths starting with /", () => {
    expect(isRelativeUrl("/foo")).toBe(true);
  });

  it("returns true for hash fragments", () => {
    expect(isRelativeUrl("#section")).toBe(true);
  });

  it("returns true for query strings", () => {
    expect(isRelativeUrl("?page=2")).toBe(true);
  });

  it("returns false for absolute http URLs", () => {
    expect(isRelativeUrl("http://example.com")).toBe(false);
  });

  it("returns false for absolute https URLs", () => {
    expect(isRelativeUrl("https://example.com")).toBe(false);
  });
});

describe("isValidUrl", () => {
  it("returns true for valid absolute https URL", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
  });

  it("returns true for valid absolute http URL", () => {
    expect(isValidUrl("http://example.com/path?q=1")).toBe(true);
  });

  it("returns true for relative URL starting with /", () => {
    expect(isValidUrl("/relative/path")).toBe(true);
  });

  it("returns true for hash fragment", () => {
    expect(isValidUrl("#anchor")).toBe(true);
  });

  it("returns false for non-URL string", () => {
    expect(isValidUrl("not a url")).toBe(false);
  });
});
