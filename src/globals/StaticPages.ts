import type { GlobalConfig } from 'payload'

const isContentEditorOrAbove = ({ req: { user } }: any) =>
  user?.role === 'super_admin' || user?.role === 'content_editor'

export const StaticPages: GlobalConfig = {
  slug: 'static-pages',
  access: {
    read: () => true,
    update: isContentEditorOrAbove,
  },
  fields: [
    {
      name: 'privacyPolicy',
      type: 'richText',
      localized: true,
    },
    {
      name: 'termsOfUse',
      type: 'richText',
      localized: true,
    },
    {
      name: 'accessibilityStatement',
      type: 'richText',
      localized: true,
    },
  ],
}
