import { describe, expect, it } from "vitest";

import type { TypeButton } from "@/lib/contentful/types";
import { getButtonUrl } from "@/lib/contentful-utils";

type MockButton = TypeButton<"WITHOUT_UNRESOLVABLE_LINKS", string>;

function makeButton(fields?: Partial<MockButton["fields"]>): MockButton {
  return {
    sys: {
      id: "btn-1",
      type: "Entry",
      contentType: {
        sys: { id: "button", type: "Link", linkType: "ContentType" },
      },
    } as MockButton["sys"],
    metadata: { tags: [], concepts: [] },
    fields: {
      variant: "default",
      label: "Click me",
      ...fields,
    } as MockButton["fields"],
  } as MockButton;
}

describe("getButtonUrl", () => {
  it("returns null when button has no fields", () => {
    expect(
      getButtonUrl({
        sys: {} as MockButton["sys"],
        metadata: { tags: [], concepts: [] },
        fields: undefined as unknown as MockButton["fields"],
      } as MockButton),
    ).toBeNull();
  });

  it("returns external href when present", () => {
    const btn = makeButton({ href: "https://example.com" });
    expect(getButtonUrl(btn)).toBe("https://example.com");
  });

  it("returns /slug for internal page content type", () => {
    const btn = makeButton({
      internal: {
        sys: {
          id: "page-1",
          type: "Entry",
          contentType: {
            sys: { id: "page", type: "Link", linkType: "ContentType" },
          },
        } as unknown as MockButton["fields"]["internal"]["sys"],
        metadata: { tags: [], concepts: [] },
        fields: {
          slug: "about-us",
        } as unknown as MockButton["fields"]["internal"]["fields"],
      } as unknown as MockButton["fields"]["internal"],
    });
    expect(getButtonUrl(btn)).toBe("/about-us");
  });

  it("returns /blog/slug for internal blog content type", () => {
    const btn = makeButton({
      internal: {
        sys: {
          id: "blog-1",
          type: "Entry",
          contentType: {
            sys: { id: "blog", type: "Link", linkType: "ContentType" },
          },
        } as unknown as MockButton["fields"]["internal"]["sys"],
        metadata: { tags: [], concepts: [] },
        fields: {
          slug: "my-post",
        } as unknown as MockButton["fields"]["internal"]["fields"],
      } as unknown as MockButton["fields"]["internal"],
    });
    expect(getButtonUrl(btn)).toBe("/blog/my-post");
  });

  it("returns null when neither href nor internal is set", () => {
    const btn = makeButton({});
    expect(getButtonUrl(btn)).toBeNull();
  });

  it("returns null when internal has no slug", () => {
    const btn = makeButton({
      internal: {
        sys: {
          id: "page-2",
          type: "Entry",
          contentType: {
            sys: { id: "page", type: "Link", linkType: "ContentType" },
          },
        } as unknown as MockButton["fields"]["internal"]["sys"],
        metadata: { tags: [], concepts: [] },
        fields: {} as unknown as MockButton["fields"]["internal"]["fields"],
      } as unknown as MockButton["fields"]["internal"],
    });
    expect(getButtonUrl(btn)).toBeNull();
  });
});
