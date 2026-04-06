import type { CollectionConfig } from 'payload'

const isSuperAdmin = ({ req: { user } }: any) => user?.role === 'super_admin'
const isContentEditorOrAbove = ({ req: { user } }: any) =>
  user?.role === 'super_admin' || user?.role === 'content_editor'
const isNotHrAdmin = ({ req: { user } }: any) =>
  user?.role === 'super_admin' || user?.role === 'content_editor' || user?.role === 'viewer'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: isContentEditorOrAbove,
    update: isContentEditorOrAbove,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'productStatus',
      type: 'select',
      required: true,
      options: [
        { label: 'Live', value: 'live' },
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Beta', value: 'beta' },
      ],
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'longDescription',
      type: 'richText',
      localized: true,
    },
    {
      name: 'features',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'feature',
          type: 'text',
        },
      ],
    },
    {
      name: 'whoItsFor',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'impactStatLabel',
      type: 'text',
      localized: true,
    },
    {
      name: 'impactStatValue',
      type: 'text',
    },
    {
      name: 'serviceUrl',
      type: 'text',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'text',
    },
    {
      name: 'audienceTags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Citizens', value: 'citizens' },
        { label: 'Businesses', value: 'businesses' },
        { label: 'Government', value: 'government' },
        { label: 'Partners', value: 'partners' },
      ],
    },
    {
      name: 'sortOrder',
      type: 'number',
    },
  ],
}
