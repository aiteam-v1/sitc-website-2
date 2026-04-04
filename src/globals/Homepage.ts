import type { GlobalConfig } from 'payload'

const isContentEditorOrAbove = ({ req: { user } }: any) =>
  user?.role === 'super_admin' || user?.role === 'content_editor'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: {
    read: isContentEditorOrAbove,
    update: isContentEditorOrAbove,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'headline',
          type: 'text',
          localized: true,
        },
        {
          name: 'subheading',
          type: 'text',
          localized: true,
        },
        {
          name: 'primaryCtaLabel',
          type: 'text',
          localized: true,
        },
        {
          name: 'primaryCtaUrl',
          type: 'text',
          localized: true,
        },
        {
          name: 'secondaryCtaLabel',
          type: 'text',
          localized: true,
        },
        {
          name: 'secondaryCtaUrl',
          type: 'text',
          localized: true,
        },
        {
          name: 'background',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'heroVideo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'heroPoster',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'audienceCards',
      type: 'relationship',
      relationTo: 'audience-cards',
      hasMany: true,
    },
    {
      name: 'impactStats',
      type: 'relationship',
      relationTo: 'impact-stats',
      hasMany: true,
    },
    {
      name: 'featuredProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
  ],
}
