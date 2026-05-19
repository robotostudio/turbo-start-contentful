import { describe, expect, it } from "vitest";

// Set env vars synchronously before client.ts (which imports env.ts) executes.
process.env["CONTENTFUL_SPACE_ID"] = "test-space";
process.env["CONTENTFUL_ACCESS_TOKEN"] = "test-token";
process.env["CONTENTFUL_DRAFT_TOKEN"] = "test-draft";

const { parseContentfulError } = await import("@/lib/contentful/client");

describe("parseContentfulError", () => {
  it("returns network message for ENOTFOUND", () => {
    expect(parseContentfulError({ code: "ENOTFOUND" })).toContain(
      "Unable to connect",
    );
  });

  it("returns network message for ECONNREFUSED", () => {
    expect(parseContentfulError({ code: "ECONNREFUSED" })).toContain(
      "Unable to connect",
    );
  });

  it("returns timeout message for ETIMEDOUT", () => {
    expect(parseContentfulError({ code: "ETIMEDOUT" })).toContain("timed out");
  });

  it("returns invalid token message for sys.id AccessTokenInvalid", () => {
    expect(
      parseContentfulError({ sys: { id: "AccessTokenInvalid" } }),
    ).toContain("Invalid access token");
  });

  it("returns not found message for sys.id NotFound", () => {
    expect(parseContentfulError({ sys: { id: "NotFound" } })).toContain(
      "not found",
    );
  });

  it("returns auth failed message for response.status 401", () => {
    expect(parseContentfulError({ response: { status: 401 } })).toContain(
      "Authentication failed",
    );
  });

  it("returns rate limit message for response.status 429", () => {
    expect(parseContentfulError({ response: { status: 429 } })).toContain(
      "Rate limit",
    );
  });

  it("returns error.message for Error instance", () => {
    const err = new Error("something went wrong");
    expect(parseContentfulError(err)).toBe("something went wrong");
  });

  it("returns unknown message for null", () => {
    expect(parseContentfulError(null)).toContain("unknown");
  });

  it("returns unknown message for undefined", () => {
    expect(parseContentfulError(undefined)).toContain("unknown");
  });

  it("returns unexpected message for non-object primitives", () => {
    expect(parseContentfulError(42)).toContain("unexpected");
  });

  it("returns fallback message field for unrecognised sys.id", () => {
    const result = parseContentfulError({
      sys: { id: "SomeOtherError" },
      message: "custom msg",
    });
    expect(result).toBe("custom msg");
  });
});
