import Elysia from 'elysia'
import { authentication } from '../authentication'
import { db } from '@/db/connection'
import { eq } from 'drizzle-orm'

export const getProfile = new Elysia()
  .use(authentication)
  .get('/me', async ({ getCurrentUser }) => {
    const { sub: userId } = await getCurrentUser()

    const user = await db.query.users.findFirst({
      where(fields) {
        return eq(fields.id, userId)
      },
    })

    if (!user) {
      throw new Error('User not found.')
    }

    return user
  })