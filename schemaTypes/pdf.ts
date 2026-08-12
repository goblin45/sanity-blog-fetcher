import {DocumentPdfIcon} from '@sanity/icons/DocumentPdf'
import {defineField, defineType} from 'sanity'
import {CdnUrlInput} from '../components/CdnUrlInput'

export default defineType({
  name: 'pdf',
  title: 'PDF',
  type: 'document',
  icon: DocumentPdfIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'file',
      title: 'PDF file',
      type: 'file',
      options: {
        accept: 'application/pdf',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cdnUrl',
      title: 'CDN URL',
      type: 'string',
      description:
        'Copy this link after uploading the PDF. It is generated from the file asset.',
      readOnly: true,
      hidden: true,
      components: {
        input: CdnUrlInput,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      filename: 'file.asset.originalFilename',
    },
    prepare({title, filename}) {
      return {
        title: title || 'Untitled PDF',
        subtitle: filename,
        media: DocumentPdfIcon,
      }
    },
  },
})