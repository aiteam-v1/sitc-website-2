import type { CollectionConfig } from 'payload'

const isSuperAdmin = ({ req: { user } }: any) => user?.role === 'super_admin'
const isContentEditorOrAbove = ({ req: { user } }: any) =>
  user?.role === 'super_admin' || user?.role === 'content_editor'
const isNotHrAdmin = ({ req: { user } }: any) =>
  user?.role === 'super_admin' || user?.role === 'content_editor' || user?.role === 'viewer'

export const Tenders: CollectionConfig = {
  slug: 'tenders',
  versions: {
    drafts: true,
  },
  access: {
    read: isNotHrAdmin,
    create: isContentEditorOrAbove,
    update: isContentEditorOrAbove,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'referenceNumber',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'deadline',
      type: 'date',
    },
    {
      name: 'document',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: { in: ['application/pdf'] },
      },
    },
    {
      name: 'tenderStatus',
      type: 'select',
      required: true,
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
        { label: 'Awarded', value: 'awarded' },
      ],
    },
  ],
}
