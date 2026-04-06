import type { GlobalConfig } from 'payload'

const isContentEditorOrAbove = ({ req: { user } }: any) =>
  user?.role === 'super_admin' || user?.role === 'content_editor'

export const Contact: GlobalConfig = {
  slug: 'contact',
  access: {
    read: () => true,
    update: isContentEditorOrAbove,
  },
  fields: [
    {
      name: 'address',
      type: 'text',
      localized: true,
    },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      localized: true,
    },
    {
      name: 'departments',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          localized: true,
        },
        {
          name: 'email',
          type: 'text',
      localized: true,
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'twitter', type: 'text' },
      localized: true,
        { name: 'facebook', type: 'text' },
      localized: true,
        { name: 'linkedin', type: 'text' },
      localized: true,
        { name: 'youtube', type: 'text' },
      localized: true,
      ],
    },
  ],
}
