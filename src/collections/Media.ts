import type { CollectionConfig } from 'payload'

const isSuperAdmin = ({ req: { user } }: any) => user?.role === 'super_admin'
const isContentEditorOrAbove = ({ req: { user } }: any) =>
  user?.role === 'super_admin' || user?.role === 'content_editor'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: true,
  access: {
    read: () => true,
    create: isContentEditorOrAbove,
    update: isContentEditorOrAbove,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: 'altText',
      type: 'text',
    },
  ],
}
