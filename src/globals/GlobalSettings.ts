import type { GlobalConfig } from 'payload'

const isSuperAdmin = ({ req: { user } }: any) => user?.role === 'super_admin'
const isContentEditorOrAbove = ({ req: { user } }: any) =>
  user?.role === 'super_admin' || user?.role === 'content_editor'

export const GlobalSettings: GlobalConfig = {
  slug: 'global-settings',
  access: {
    read: () => true,
    update: isSuperAdmin,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      localized: true,
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
      localized: true,
    },
    {
      name: 'contactPhone',
      type: 'text',
      localized: true,
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
      localized: true,
        { name: 'facebook', type: 'text' },
      localized: true,
        { name: 'linkedin', type: 'text' },
      localized: true,
        { name: 'youtube', type: 'text' },
      localized: true,
      ],
    },
    {
      name: 'analyticsId',
      type: 'text',
      localized: true,
    },
    {
      name: 'seoTitleFormat',
      type: 'text',
      localized: true,
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
