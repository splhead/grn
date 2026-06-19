import { relations, sql } from 'drizzle-orm'
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp
} from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const newsStatusEnum = pgEnum('news_status', [
  'draft',
  'review',
  'published'
])

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  active: boolean().default(true),
  roles: text('roles')
    .array()
    .notNull()
    .default(sql`'{}'`),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull()
})

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' })
  },
  table => [index('session_userId_idx').on(table.userId)]
)

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  table => [index('account_userId_idx').on(table.userId)]
)

export const categoriesTable = pgTable('categories', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description')
})

export const newsTable = pgTable('news', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  slug: text('slug').unique(),
  coverImage: text('cover_image'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  body: text('body'),
  authorId: text('author_id').references(() => user.id, {
    onDelete: 'set null'
  }),
  status: newsStatusEnum('status').default('draft').notNull()
})

export const newsCategoriesTable = pgTable(
  'news_categories',
  {
    newsId: text('news_id')
      .notNull()
      .references(() => newsTable.id, { onDelete: 'cascade' }),
    categoryId: text('category_id')
      .notNull()
      .references(() => categoriesTable.id, { onDelete: 'cascade' })
  },
  table => [
    primaryKey({ columns: [table.newsId, table.categoryId] }),
    index('news_categories_news_id_idx').on(table.newsId),
    index('news_categories_category_id_idx').on(table.categoryId)
  ]
)

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  table => [index('verification_identifier_idx').on(table.identifier)]
)

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  articles: many(newsTable)
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id]
  })
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id]
  })
}))

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  news: many(newsCategoriesTable)
}))

export const newsRelations = relations(newsTable, ({ one, many }) => ({
  author: one(user, {
    fields: [newsTable.authorId],
    references: [user.id]
  }),
  categories: many(newsCategoriesTable)
}))

export const newsCategoriesRelations = relations(
  newsCategoriesTable,
  ({ one }) => ({
    news: one(newsTable, {
      fields: [newsCategoriesTable.newsId],
      references: [newsTable.id]
    }),
    category: one(categoriesTable, {
      fields: [newsCategoriesTable.categoryId],
      references: [categoriesTable.id]
    })
  })
)
