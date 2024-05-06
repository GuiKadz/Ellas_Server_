import Elysia from 'elysia'
import { authentication } from '../authentication'
import { and, count, eq, gte, sql } from 'drizzle-orm'
import dayjs from 'dayjs'
import { db } from '@/db/connection'
import { occurrences } from '@/db/schema'

export const getOccurencesAmount = new Elysia()
  .use(authentication)
  .get('/reports/occurrences/current-and-previous-month', async () => {
    const today = dayjs()
    const lastMonth = today.subtract(1, 'month')
    const startOfLastMonth = lastMonth.startOf('month')

    /**
     * January is ZERO, that's why we need to sum 1 to get the actual month
     */
    const lastMonthWithYear = lastMonth.format('YYYY-MM')
    const currentMonthWithYear = today.format('YYYY-MM')

    const occurrencesPerMonth = await db
      .select({
        monthWithYear: sql<string>`TO_CHAR(${occurrences.createdAt}, 'YYYY-MM')`,
        amount: count(occurrences.id),
      })
      .from(occurrences)
      .where(
          gte(occurrences.createdAt, startOfLastMonth.toDate())
      )
      .groupBy(sql`TO_CHAR(${occurrences.createdAt}, 'YYYY-MM')`)
      .having(({ amount }) => gte(amount, 1))

    const currentMonthoccurrencesAmount = occurrencesPerMonth.find((occurrencesInMonth) => {
      return occurrencesInMonth.monthWithYear === currentMonthWithYear
    })

    const lastMonthoccurrencesAmount = occurrencesPerMonth.find((occurrencesInMonth) => {
      return occurrencesInMonth.monthWithYear === lastMonthWithYear
    })

    const diffFromLastMonth =
      lastMonthoccurrencesAmount && currentMonthoccurrencesAmount
        ? (currentMonthoccurrencesAmount.amount * 100) / lastMonthoccurrencesAmount.amount
        : null

    return {
      amount: currentMonthoccurrencesAmount?.amount ?? 0,
      diffFromLastMonth: diffFromLastMonth
        ? Number((diffFromLastMonth - 100).toFixed(2))
        : 0,
    }
  })