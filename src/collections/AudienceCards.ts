import type { CollectionConfig } from 'payload'

const isSuperAdmin = ({ req: { user } }: any) => user?.role === 'super_admin'
const isContentEditorOrAbove = ({ req: { user } }: any) =>
  user?.role === 'super_admin' || user?.role === 'content_editor'
const isNotHrAdmin = ({ req: { user } }: any) =>
  user?.role === 'super_admin' || user?.role === 'content_editor' || user?.role === 'viewer'

export const AudienceCards: CollectionConfig = {
  slug: 'audience-cards',
  admin: {
    useAsTitle: 'headline',
  },
  access: {
    read: () => true,
    create: isContentEditorOrAbove,
    update: isContentEditorOrAbove,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'subtext',
      type: 'text',
      localized: true,
    },
    {
      name: 'linkUrl',
      type: 'text',
    },
    {
      name: 'sortOrder',
      type: 'number',
    },
  ],
}
