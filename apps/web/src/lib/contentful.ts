import * as contentful from "contentful";

import { accessToken, previewToken, spaceId } from "./env";

export function getClient(preview = false) {
  return contentful.createClient({
    accessToken: preview ? previewToken || accessToken : accessToken,
    space: spaceId,
  });
}
