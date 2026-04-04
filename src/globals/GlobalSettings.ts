import type { GlobalConfig } from 'payload'

const isSuperAdmin = ({ req: { user } }: any) => user?.role === 'super_admin'
const isContentEditorOrAbove = ({ req: { user } }: any) =>
  user?.role === 'super_admin' || user?.role === 'content_editor'

export const GlobalSettings: GlobalConfig = {
  slug: 'global-settings',
  access: {
    read: isContentEditorOrAbove,
    update: isSuperAdmin,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'contactEmail',
      type: 'text',
    },
    {
      name: 'contactPhone',
      type: 'text',
    },
    {
      name: 'contactAddress',
      type: 'text',
      localized: true,
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'twitter', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },
    {
      name: 'analyticsId',
      type: 'text',
    },
    {
      name: 'seoTitleFormat',
      type: 'text',
    },
    {
      name: 'seoDefaultOgImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'activeLanguages',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'English', value: 'en' },
        { label: 'Urdu', value: 'ur' },
        { label: 'Sindhi', value: 'sd' },
      ],
    },
  ],
}
