import type { GlobalConfig } from 'payload'

const isContentEditorOrAbove = ({ req: { user } }: any) =>
  user?.role === 'super_admin' || user?.role === 'content_editor'

export const About: GlobalConfig = {
  slug: 'about',
  access: {
    read: () => true,
    update: isContentEditorOrAbove,
  },
  fields: [
    {
      name: 'mission',
      type: 'richText',
      localized: true,
    },
    {
      name: 'vision',
      type: 'richText',
      localized: true,
    },
    {
      name: 'mandate',
      type: 'richText',
      localized: true,
    },
    {
      name: 'coreValues',
      type: 'richText',
      localized: true,
    },
    {
      name: 'whatWeDo',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'icon',
          type: 'text',
        },
      ],
    },
  ],
}
