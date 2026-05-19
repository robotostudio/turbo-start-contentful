import { describe, expect, it } from "vitest";

// Set env vars synchronously before env.ts module executes its assertValue calls.
// vi.stubEnv runs inside beforeAll which is too late for top-level module side effects.
process.env["CONTENTFUL_SPACE_ID"] = "test-space";
process.env["CONTENTFUL_ACCESS_TOKEN"] = "test-token";
process.env["CONTENTFUL_DRAFT_TOKEN"] = "test-draft";

const { assertValue } = await import("@/lib/env");

describe("assertValue", () => {
  it("throws when value is undefined", () => {
    expect(() => assertValue(undefined, "MY_VAR is missing")).toThrow(
      "MY_VAR is missing",
    );
  });

  it("returns the value when defined", () => {
    expect(assertValue("hello", "should not throw")).toBe("hello");
  });

  it("returns numeric values", () => {
    expect(assertValue(42, "should not throw")).toBe(42);
  });

  it("returns falsy-but-defined empty string", () => {
    expect(assertValue("", "should not throw")).toBe("");
  });

  it("returns false (falsy but defined)", () => {
    expect(assertValue(false, "should not throw")).toBe(false);
  });
});
