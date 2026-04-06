import type { CollectionConfig } from 'payload'

const isSuperAdmin = ({ req: { user } }: any) => user?.role === 'super_admin'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'super_admin') return true
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    create: isSuperAdmin,
    update: ({ req: { user } }) => {
      if (user?.role === 'super_admin') return true
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'viewer',
      options: [
        { label: 'Super Admin', value: 'super_admin' },
        { label: 'Content Editor', value: 'content_editor' },
        { label: 'HR Admin', value: 'hr_admin' },
        { label: 'Viewer', value: 'viewer' },
      ],
    },
  ],
}
