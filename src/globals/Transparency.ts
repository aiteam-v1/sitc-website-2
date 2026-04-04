import type { GlobalConfig } from 'payload'

const isContentEditorOrAbove = ({ req: { user } }: any) =>
  user?.role === 'super_admin' || user?.role === 'content_editor'

export const Transparency: GlobalConfig = {
  slug: 'transparency',
  access: {
    read: isContentEditorOrAbove,
    update: isContentEditorOrAbove,
  },
  fields: [
    {
      name: 'dashboardContent',
      type: 'richText',
      localized: true,
    },
    {
      name: 'annualReports',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'year',
          type: 'number',
        },
        {
          name: 'document',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
