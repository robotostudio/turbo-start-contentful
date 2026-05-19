import { describe, expect, it } from "vitest";

import { safeAsync } from "@/safe-async";

describe("safeAsync", () => {
  it("returns { success: true, data } when promise resolves", async () => {
    const result = await safeAsync(Promise.resolve(42));
    expect(result).toEqual({ success: true, data: 42 });
  });

  it("returns { success: false, error: Error } when promise rejects with an Error", async () => {
    const err = new Error("boom");
    const result = await safeAsync(Promise.reject(err));
    expect(result).toEqual({ success: false, error: err });
    expect(result.success === false && result.error).toBeInstanceOf(Error);
  });

  it("wraps non-Error rejections in a new Error", async () => {
    const result = await safeAsync(Promise.reject("string error"));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe("string error");
    }
  });

  it("wraps null rejection in a new Error", async () => {
    const result = await safeAsync(Promise.reject(null));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(Error);
    }
  });
});
