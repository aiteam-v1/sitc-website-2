import type { GlobalConfig } from 'payload'

const isSuperAdmin = ({ req: { user } }: any) => user?.role === 'super_admin'
const isContentEditorOrAbove = ({ req: { user } }: any) =>
  user?.role === 'super_admin' || user?.role === 'content_editor'

export const GlobalSettings: GlobalConfig = {
  slug: 'global-settings',
  access: {
    read: () => true,
    update: isContentEditorOrAbove,
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
      name: 'contactDetails',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'text',
          localized: true,
        },
        {
          name: 'phone',
          type: 'text',
          localized: true,
        },
        {
          name: 'address',
          type: 'textarea',
          localized: true,
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Twitter', value: 'twitter' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Instagram', value: 'instagram' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'analyticsId',
      type: 'text',
    },
    {
      name: 'seoDefaults',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'defaultOgImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'activeLanguages',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'English', value: 'en' },
        { label: 'Urdu', value: 'ur' },
        { label: 'Sindhi', value: 'sd' },
      ],
    },
  ],
}
