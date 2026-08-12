import {ImagesIcon} from '@sanity/icons/Images'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'gallery',
  title: 'Photo gallery',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [defineArrayMember({type: 'galleryPhoto'})],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'photos.0.image',
      photoCount: 'photos',
    },
    prepare({title, media, photoCount}) {
      const count = Array.isArray(photoCount) ? photoCount.length : 0
      return {
        title: title || 'Untitled gallery',
        subtitle: `${count} photo${count === 1 ? '' : 's'}`,
        media: media || ImagesIcon,
      }
    },
  },
})
