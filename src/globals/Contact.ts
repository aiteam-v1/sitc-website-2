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
      type: 'textarea',
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
          required: true,
        },
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'phone',
          type: 'text',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Twitter', value: 'twitter' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Instagram', value: 'instagram' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
        },
      ],
    },
  ],
}
