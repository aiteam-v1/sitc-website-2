import type { GlobalConfig } from 'payload'

const isContentEditorOrAbove = ({ req: { user } }: any) =>
  user?.role === 'super_admin' || user?.role === 'content_editor'

export const Contact: GlobalConfig = {
  slug: 'contact',
  access: {
    read: isContentEditorOrAbove,
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
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'twitter', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },
  ],
}
