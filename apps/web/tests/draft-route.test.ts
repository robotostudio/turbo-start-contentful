import { describe, expect, it } from "vitest";

import { SAFE_PATH_RE } from "@/lib/url";

describe("SAFE_PATH_RE", () => {
  describe("accepts valid local paths", () => {
    it.each([
      ["/"],
      ["/foo"],
      ["/foo/bar"],
      ["/foo?bar=baz"],
      ["/foo#section"],
      ["/foo/bar-baz_qux.html"],
      ["/foo?a=1&b=2"],
      ["/foo%20bar"],
    ])("accepts %s", (path) => {
      expect(SAFE_PATH_RE.test(path)).toBe(true);
    });
  });

  describe("rejects unsafe paths", () => {
    it.each([
      ["//evil.com"],
      ["/\\evil"],
      ["https://evil.com"],
      ["http://x"],
      ["<script>"],
      ["javascript:alert(1)"],
      [""],
      ["relative"],
      ["//"],
    ])("rejects %s", (path) => {
      expect(SAFE_PATH_RE.test(path)).toBe(false);
    });
  });
});
