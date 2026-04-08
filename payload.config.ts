import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Products } from './src/collections/Products'
import { Articles } from './src/collections/Articles'
import { Tenders } from './src/collections/Tenders'
import { ImpactStats } from './src/collections/ImpactStats'
import { AudienceCards } from './src/collections/AudienceCards'
import { Media } from './src/collections/Media'
import { Pages } from './src/collections/Pages'
import { Users } from './src/collections/Users'

import { GlobalSettings } from './src/globals/GlobalSettings'
import { Homepage } from './src/globals/Homepage'
import { About } from './src/globals/About'
import { Contact } from './src/globals/Contact'
import { DigitalGovernment } from './src/globals/DigitalGovernment'
import { Partnerships } from './src/globals/Partnerships'
import { Transparency } from './src/globals/Transparency'
import { StaticPages } from './src/globals/StaticPages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [
    Media,
    Pages,
    Users,
    Products,
    Articles,
    Tenders,
    ImpactStats,
    AudienceCards,
  ],
  globals: [
    GlobalSettings,
    Homepage,
    About,
    Contact,
    DigitalGovernment,
    Partnerships,
    Transparency,
    StaticPages,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? '',
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL ?? '',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'اردو', code: 'ur' },
      { label: 'سنڌي', code: 'sd' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  upload: {
    limits: {
      fileSize: 20 * 1024 * 1024,
    },
  },
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
})
