import type { GlobalConfig } from 'payload'

const isContentEditorOrAbove = ({ req: { user } }: any) =>
  user?.role === 'super_admin' || user?.role === 'content_editor'

export const DigitalGovernment: GlobalConfig = {
  slug: 'digital-government',
  access: {
    read: isContentEditorOrAbove,
    update: isContentEditorOrAbove,
  },
  fields: [
    {
      name: 'transformationContent',
      type: 'richText',
      localized: true,
    },
    {
      name: 'roadmapContent',
      type: 'richText',
      localized: true,
    },
  ],
}
