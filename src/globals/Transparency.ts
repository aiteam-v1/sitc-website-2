import type { GlobalConfig } from 'payload'

const isContentEditorOrAbove = ({ req: { user } }: any) =>
  user?.role === 'super_admin' || user?.role === 'content_editor'

export const Transparency: GlobalConfig = {
  slug: 'transparency',
  access: {
    read: () => true,
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
          localized: true,
          required: true,
        },
        {
          name: 'year',
          type: 'number',
          required: true,
        },
        {
          name: 'document',
          type: 'upload',
          relationTo: 'media',
          required: true,
          filterOptions: {
            mimeType: { in: ['application/pdf'] },
          },
        },
      ],
    },
  ],
}
