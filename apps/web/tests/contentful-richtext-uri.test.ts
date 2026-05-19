import { describe, expect, it } from "vitest";

import { isSafeUri } from "@/lib/uri";

describe("isSafeUri", () => {
  describe("accepts safe URIs", () => {
    it.each([
      ["http://example.com"],
      ["https://example.com/path"],
      ["mailto:user@example.com"],
      ["/relative/path"],
      ["#hash-anchor"],
      ["?query=string"],
      ["/path?foo=bar"],
    ])("accepts %s", (uri) => {
      expect(isSafeUri(uri)).toBe(true);
    });
  });

  describe("rejects unsafe URIs", () => {
    it.each([
      ["//protocol-relative.com"],
      ["javascript:alert(1)"],
      ["data:text/html,<h1>hi</h1>"],
      ["vbscript:msgbox(1)"],
      ["file:///etc/passwd"],
      ["//"],
    ])("rejects %s", (uri) => {
      expect(isSafeUri(uri)).toBe(false);
    });
  });
});
