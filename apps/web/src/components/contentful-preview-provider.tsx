"use client";

import type { ContentfulLivePreviewInitConfig } from "@contentful/live-preview";
import { ContentfulLivePreviewProvider } from "@contentful/live-preview/react";
import type { PropsWithChildren } from "react";

export function ContentfulPreviewProvider({
  children,
  ...props
}: PropsWithChildren<ContentfulLivePreviewInitConfig>) {
  return (
    <ContentfulLivePreviewProvider {...props}>
      {children}
    </ContentfulLivePreviewProvider>
  );
}
