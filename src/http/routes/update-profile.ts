import Elysia, { t } from 'elysia'
import { authentication } from '../authentication'
import { db } from '@/db/connection'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const updateProfile = new Elysia().use(authentication).put(
  '/profile',
  async ({ getManagedInstituteId, set, body }) => {
    const instituteId = await getManagedInstituteId()
    const { phone, email } = body

    await db
      .update(users)
      .set({
        phone,
        email,
      })
      .where(eq(users.id, instituteId))

    set.status = 204
  },
  {
    body: t.Object({
      phone: t.Optional(t.String()),
      email: t.Optional(t.String()),
    }),
  },
)