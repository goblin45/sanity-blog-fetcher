import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'galleryPhoto',
  title: 'Gallery photo',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (Rule) => Rule.warning('Alt text helps accessibility and SEO'),
        }),
      ],
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'shape',
      title: 'Shape',
      type: 'string',
      options: {
        list: [
          {title: 'Rectangle', value: 'rectangle'},
          {title: 'Rounded', value: 'rounded'},
          {title: 'Circle', value: 'circle'},
          {title: 'Pill', value: 'pill'},
        ],
        layout: 'radio',
      },
      initialValue: 'rectangle',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'object',
      description: 'Width and height as percentages of the gallery canvas (0–100).',
      fields: [
        defineField({
          name: 'width',
          title: 'Width (%)',
          type: 'number',
          validation: (Rule) => Rule.required().min(1).max(100),
          initialValue: 30,
        }),
        defineField({
          name: 'height',
          title: 'Height (%)',
          type: 'number',
          validation: (Rule) => Rule.required().min(1).max(100),
          initialValue: 30,
        }),
      ],
      options: {columns: 2},
    }),
    defineField({
      name: 'position',
      title: 'Position',
      type: 'object',
      description: 'Top-left position as percentages of the gallery canvas (0–100).',
      fields: [
        defineField({
          name: 'x',
          title: 'X (%)',
          type: 'number',
          validation: (Rule) => Rule.required().min(0).max(100),
          initialValue: 0,
        }),
        defineField({
          name: 'y',
          title: 'Y (%)',
          type: 'number',
          validation: (Rule) => Rule.required().min(0).max(100),
          initialValue: 0,
        }),
      ],
      options: {columns: 2},
    }),
  ],
  preview: {
    select: {
      title: 'caption',
      alt: 'image.alt',
      media: 'image',
      shape: 'shape',
      width: 'size.width',
      height: 'size.height',
      x: 'position.x',
      y: 'position.y',
    },
    prepare({title, alt, media, shape, width, height, x, y}) {
      return {
        title: title || alt || 'Photo',
        subtitle: `${shape || 'rectangle'} · ${width ?? '?'}×${height ?? '?'}% @ (${x ?? 0}, ${y ?? 0})`,
        media,
      }
    },
  },
})
