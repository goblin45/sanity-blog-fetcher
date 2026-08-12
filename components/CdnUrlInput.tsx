import {CopyIcon} from '@sanity/icons/Copy'
import {Button, Card, Flex, Stack, Text, TextInput} from '@sanity/ui'
import {useEffect, useState} from 'react'
import {type StringInputProps, useClient, useFormValue} from 'sanity'

type FileValue = {
  asset?: {
    _ref?: string
  }
}

export function CdnUrlInput(props: StringInputProps) {
  const file = useFormValue(['file']) as FileValue | undefined
  const client = useClient({apiVersion: '2025-01-01'})
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const assetId = file?.asset?._ref
    if (!assetId) {
      setUrl('')
      return
    }

    let cancelled = false
    client
      .fetch<string | null>(`*[_id == $id][0].url`, {id: assetId})
      .then((assetUrl) => {
        if (!cancelled) setUrl(assetUrl || '')
      })
      .catch(() => {
        if (!cancelled) setUrl('')
      })

    return () => {
      cancelled = true
    }
  }, [client, file?.asset?._ref])

  async function handleCopy() {
    if (!url) return
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  if (!url) {
    return (
      <Card padding={3} radius={2} tone="transparent" border>
        <Text size={1} muted>
          Upload a PDF to get its CDN URL.
        </Text>
      </Card>
    )
  }

  return (
    <Stack space={2}>
      <Flex gap={2}>
        <Card flex={1}>
          <TextInput readOnly value={url} />
        </Card>
        <Button
          mode="ghost"
          icon={CopyIcon}
          text={copied ? 'Copied' : 'Copy'}
          onClick={handleCopy}
          tone={copied ? 'positive' : 'default'}
        />
      </Flex>
      <Text size={1} muted>
        Hosted on Sanity CDN.
      </Text>
    </Stack>
  )
}
