import type { GlobalConfig } from 'payload'

const isContentEditorOrAbove = ({ req: { user } }: any) =>
  user?.role === 'super_admin' || user?.role === 'content_editor'

export const Partnerships: GlobalConfig = {
  slug: 'partnerships',
  access: {
    read: isContentEditorOrAbove,
    update: isContentEditorOrAbove,
  },
  fields: [
    {
      name: 'pppContent',
      type: 'richText',
      localized: true,
    },
  ],
}
