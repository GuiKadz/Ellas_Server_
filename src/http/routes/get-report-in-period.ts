import Elysia, { t } from "elysia";
import { and, count, gte, lte, sql } from "drizzle-orm";
import dayjs from "dayjs";
import { db } from "@/db/connection";
import { occurrences } from "@/db/schema";

export const getReportInPeriod = new Elysia().get(
  "/reports/daily-result-in-period",
  async ({ query, set }) => {
    const { from, to } = query;
    const startDate = from ? dayjs(from) : dayjs().subtract(7, "d");
    const endDate = to ? dayjs(to) : from ? startDate.add(7, "days") : dayjs();
    console.log(startDate, endDate);

    const resultPerDay = await db
  .select({
    date: sql<Date>`DATE_TRUNC('day', ${occurrences.createdAt})`,
    result: count(occurrences.id),
  })
  .from(occurrences)
  .where(
    and(
      gte(
        occurrences.createdAt,
        startDate
          .startOf('day')
          .add(startDate.utcOffset(), 'minutes')
          .toDate(),
      ),
      lte(
        occurrences.createdAt,
        endDate.endOf('day').add(endDate.utcOffset(), 'minutes').toDate(),
      ),
    ),
  )
  .groupBy(sql<Date>`DATE_TRUNC('day', ${occurrences.createdAt})`)
  .orderBy(sql<Date>`DATE_TRUNC('day', ${occurrences.createdAt})`);

const orderResultPerDay = resultPerDay.map((row) => {
  return {
    date: row.date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }),
    result: row.result || 0,
  };
});
    console.log(orderResultPerDay);
    return orderResultPerDay;
  },
  {
    query: t.Object({
      from: t.Optional(t.String()),
      to: t.Optional(t.String()),
    }),
  }
);
