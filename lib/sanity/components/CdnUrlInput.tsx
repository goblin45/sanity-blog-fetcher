'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { set, unset, useFormValue, type StringInputProps } from 'sanity';
import { Box, Button, Card, Flex, Stack, Text, TextInput } from '@sanity/ui';

/**
 * Read-only Studio input that derives a CDN URL from the sibling `file`
 * asset and writes it into the `cdnUrl` field for easy copying.
 *
 * @param props - Sanity string input props for the `cdnUrl` field.
 * @returns A copyable CDN URL field UI.
 */
export function CdnUrlInput(props: StringInputProps) {
  // Added/Modified by Rajarshi for TBD — START
  const { value, onChange, readOnly, elementProps } = props;
  const file = useFormValue(['file']) as
    | { asset?: { _ref?: string; url?: string } }
    | undefined;

  const derivedUrl = useMemo(() => {
    const ref = file?.asset?._ref;
    if (!ref) {
      return '';
    }

    // Sanity file asset refs look like: file-<hash>-pdf
    const match = /^file-([a-f0-9]+)-([a-z0-9]+)$/i.exec(ref);
    if (!match) {
      return file?.asset?.url ?? '';
    }

    const [, assetId, extension] = match;
    return `https://cdn.sanity.io/files/12jszf8z/production/${assetId}.${extension}`;
  }, [file]);

  useEffect(() => {
    if (!derivedUrl) {
      if (value) {
        onChange(unset());
      }
      return;
    }

    if (value !== derivedUrl) {
      onChange(set(derivedUrl));
    }
  }, [derivedUrl, onChange, value]);

  const handleCopy = useCallback(async () => {
    if (!derivedUrl || typeof navigator === 'undefined') {
      return;
    }

    await navigator.clipboard.writeText(derivedUrl);
  }, [derivedUrl]);

  return (
    <Stack space={3}>
      <Text
        size={1}
        muted
      >
        Generated from the uploaded PDF asset. Copy this URL for sharing or
        frontend use.
      </Text>
      <Flex gap={2}>
        <Box flex={1}>
          <TextInput
            {...elementProps}
            value={derivedUrl || value || ''}
            readOnly={readOnly ?? true}
          />
        </Box>
        <Button
          mode="ghost"
          text="Copy"
          disabled={!derivedUrl}
          onClick={handleCopy}
        />
      </Flex>
      {!derivedUrl ? (
        <Card
          padding={3}
          radius={2}
          tone="caution"
        >
          <Text size={1}>Upload a PDF file to generate the CDN URL.</Text>
        </Card>
      ) : null}
    </Stack>
  );
  // Added/Modified by Rajarshi for TBD — END
}
