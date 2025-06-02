import {
  CopyIcon,
  EditIcon,
  FolderIcon,
  WarningOutlineIcon,
} from "@sanity/icons";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Stack,
  Text,
  TextInput,
} from "@sanity/ui";
import type { FocusEvent, FormEvent, MouseEvent } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  getPublishedId,
  type ObjectFieldProps,
  type SanityDocument,
  set,
  type SlugValue,
  unset,
  useFormValue,
  useValidationStatus,
} from "sanity";
import slugify from "slugify";
import { styled } from "styled-components";

import { getDocumentPath, stringToPathname } from "../utils/helper";

const presentationOriginUrl = process.env.SANITY_STUDIO_PRESENTATION_URL;

const UnlockButton = styled(Button)`
  cursor: pointer;
  > span:nth-of-type(2) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
`;

const CopyButton = styled(Button)`
  margin-left: auto;
  cursor: pointer;
  > span:nth-of-type(2) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
`;

const GenerateButton = styled(Button)`
  margin-left: auto;
  cursor: pointer;
`;

const FolderText = styled(Text)`
  span {
    white-space: nowrap;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }
`;

export function PathnameFieldComponent(props: ObjectFieldProps<SlugValue>) {
  const document = useFormValue([]) as SanityDocument;
  const publishedId = getPublishedId(document?._id as string);
  const validation = useValidationStatus(publishedId, document?._type);

  const slugValidationError = useMemo(
    () =>
      validation.validation.find(
        (v) =>
          (v?.path.includes("current") || v?.path.includes("slug")) &&
          v.message,
      ),
    [validation.validation],
  );
  const {
    inputProps: { onChange, value, readOnly },
    title,
    description,
  } = props;

  const segments = useMemo(
    () => value?.current?.split("/").filter(Boolean) || [],
    [value],
  );
  const [folderLocked, setFolderLocked] = useState(segments.length > 1);

  const fullPathInputRef = useRef<HTMLInputElement>(null);
  const pathSegmentInputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (value?: string) => {
      const finalValue = value
        ? stringToPathname(value, { allowTrailingSlash: true })
        : undefined;
      onChange(
        typeof value === "string"
          ? set({
              current: finalValue,
              _type: "slug",
            })
          : unset(),
      );
    },
    [onChange],
  );

  const handleGenerate = useCallback(() => {
    const title = document?.title as string | undefined;
    if (title) {
      const newSegments = [...segments];
      if (newSegments.length > 1) {
        newSegments[newSegments.length - 1] = slugify(title, {
          lower: true,
          remove: /[^a-zA-Z0-9 ]/g,
        });
      } else {
        newSegments[0] = slugify(title, {
          lower: true,
          remove: /[^a-zA-Z0-9 ]/g,
        });
      }
      handleChange(newSegments.join("/"));
    }
  }, [document?.title, handleChange, segments]);

  const updateSegment = useCallback(
    (index: number, newValue: string) => {
      const newSegments = [...segments];
      newSegments[index] = slugify(newValue, {
        lower: true,
        remove: /[^a-zA-Z0-9 ]/g,
      });
      handleChange(newSegments.join("/"));
    },
    [segments, handleChange],
  );

  const updateFullPath = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      handleChange(e.currentTarget.value);
    },
    [handleChange],
  );

  const unlockFolder = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFolderLocked(false);
    requestAnimationFrame(() => {
      fullPathInputRef.current?.focus();
    });
  }, []);

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setFolderLocked(segments.length > 1);
    },
    [segments],
  );

  const localizedPathname = getDocumentPath({
    ...document,
    slug: value?.current,
  });

  const pathInput = useMemo(() => {
    if (folderLocked && segments.length > 1) {
      return (
        <Stack space={2} width="100%" style={{ flex: 1 }}>
          <Flex gap={2} wrap="wrap">
            {segments.slice(0, -1).map((segment) => (
              <Flex key={segment} gap={1} align="center">
                <Card paddingX={2} paddingY={2} border tone="transparent">
                  <Flex gap={2}>
                    <Text muted>
                      <FolderIcon />
                    </Text>
                    <FolderText muted>{segment}</FolderText>
                  </Flex>
                </Card>
                <Text muted size={4}>
                  /
                </Text>
              </Flex>
            ))}
            <Flex gap={1} flex={1} align="center">
              <Box flex={1} width="100%">
                <TextInput
                  width="100%"
                  value={segments[segments.length - 1] || ""}
                  onChange={(e) =>
                    updateSegment(segments.length - 1, e.currentTarget.value)
                  }
                  ref={pathSegmentInputRef}
                  onBlur={handleBlur}
                  disabled={readOnly}
                />
              </Box>
            </Flex>
            <UnlockButton
              icon={EditIcon}
              onClick={unlockFolder}
              title="Edit full path"
              mode="bleed"
              tone="primary"
              padding={2}
              fontSize={1}
              disabled={readOnly}
            >
              <span />
            </UnlockButton>
          </Flex>
        </Stack>
      );
    }

    return (
      <Stack space={2} style={{ flex: 1, width: "100%" }}>
        <Box width="100%">
          <TextInput
            value={value?.current || ""}
            onChange={updateFullPath}
            ref={fullPathInputRef}
            onBlur={handleBlur}
            disabled={readOnly}
            style={{ width: "100%" }}
          />
        </Box>
      </Stack>
    );
  }, [
    folderLocked,
    segments,
    value,
    updateFullPath,
    handleBlur,
    readOnly,
    unlockFolder,
    updateSegment,
  ]);

  return (
    <Stack space={3}>
      <Stack space={2} flex={1}>
        <Text size={1} weight="semibold">
          {title}
        </Text>
        {description && <Text size={1}>{description}</Text>}
      </Stack>

      {typeof value?.current === "string" && (
        <Flex direction="column" gap={2}>
          <Flex align="center">
            <p
              style={{
                textOverflow: "ellipsis",
                margin: 0,
                overflow: "hidden",
                whiteSpace: "nowrap",
                color: "var(--card-muted-fg-color)",
              }}
            >
              {`${presentationOriginUrl ?? ""}${localizedPathname}`}
            </p>
            <CopyButton
              icon={CopyIcon}
              onClick={() =>
                navigator.clipboard.writeText(
                  `${presentationOriginUrl ?? ""}${localizedPathname}`,
                )
              }
              title="Copy link"
              mode="bleed"
              tone="primary"
              fontSize={1}
            >
              <span />
            </CopyButton>
          </Flex>
        </Flex>
      )}

      <Flex gap={2}>
        {pathInput}
        <Stack>
          <GenerateButton
            text="Generate"
            aria-label="Generate URL slug from title"
            title="Generate URL slug from title"
            type="button"
            mode="default"
            tone="primary"
            fontSize={1}
            disabled={!document?.title}
            onClick={handleGenerate}
          />
        </Stack>
      </Flex>
      {slugValidationError ? (
        <Badge
          tone="critical"
          padding={4}
          style={{
            borderRadius: "var(--card-radius)",
          }}
        >
          <Flex gap={4} align="center">
            <WarningOutlineIcon />
            <Text size={1} color="red">
              {slugValidationError.message}
            </Text>
          </Flex>
        </Badge>
      ) : null}
    </Stack>
  );
}
