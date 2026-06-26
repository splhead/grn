import { NextResponse } from 'next/server'
import { hashPassword } from 'better-auth/crypto'
import { revalidateCategoriesCache } from '@/lib/categories-cache'
import { db } from '@/lib/db'
import { account, categoriesTable, user } from '@/lib/db/schema'
import { seedData } from '@/lib/news-seed'
import { and, eq, inArray, sql } from 'drizzle-orm'
import { v7 as uuidv7 } from 'uuid'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD

  if (!adminPassword || adminPassword.length < 8) {
    return NextResponse.json(
      {
        message: 'Defina SEED_ADMIN_PASSWORD com pelo menos 8 caracteres antes de executar o seed.'
      },
      { status: 500 }
    )
  }

  const admins = [
    {
      name: 'Silas Ladislau',
      email: 'splhead@gmail.com',
      emailVerified: true,
      roles: ['admin']
    },
    {
      name: 'Igor Pinho Barbosa',
      email: 'igorjpinho@hotmail.com',
      emailVerified: true,
      roles: ['admin']
    }
  ]

  const result = await db.transaction(async tx => {
    const adminEmails = admins.map(admin => admin.email)
    const adminsFound = await tx
      .select()
      .from(user)
      .where(inArray(user.email, adminEmails))

    const foundEmails = new Set(adminsFound.map(admin => admin.email))
    const adminsToCreate = admins
      .filter(admin => !foundEmails.has(admin.email))
      .map(admin => ({
        id: uuidv7(),
        ...admin
      }))

    if (adminsToCreate.length > 0) {
      await tx.insert(user).values(adminsToCreate)
    }

    const adminUsers = [...adminsFound, ...adminsToCreate]
    const credentialAccounts = await tx
      .select({ userId: account.userId })
      .from(account)
      .where(
        and(
          inArray(
            account.userId,
            adminUsers.map(admin => admin.id)
          ),
          eq(account.providerId, 'credential')
        )
      )

    const userIdsWithCredential = new Set(credentialAccounts.map(account => account.userId))
    const usersWithoutCredential = adminUsers.filter(admin => !userIdsWithCredential.has(admin.id))

    if (usersWithoutCredential.length > 0) {
      const credentialAccountsToCreate = await Promise.all(
        usersWithoutCredential.map(async admin => ({
          id: uuidv7(),
          accountId: admin.id,
          providerId: 'credential',
          userId: admin.id,
          password: await hashPassword(adminPassword)
        }))
      )

      await tx.insert(account).values(credentialAccountsToCreate)
    }

    await tx
      .insert(categoriesTable)
      .values(seedData.categories)
      .onConflictDoUpdate({
        target: categoriesTable.slug,
        set: {
          name: sql`excluded.name`,
          description: sql`excluded.description`
        }
      })

    return {
      adminsFound: adminsFound.length,
      adminsCreated: adminsToCreate.length,
      credentialAccountsCreated: usersWithoutCredential.length,
      categoriesSeeded: seedData.categories.length
    }
  })

  revalidateCategoriesCache()

  return NextResponse.json(
    {
      message: 'Seed executado com sucesso.',
      ...result
    },
    { status: 201 }
  )
}
