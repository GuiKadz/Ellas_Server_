import { sql } from 'drizzle-orm';
import Elysia from "elysia";
import { authentication } from "../authentication";
import { db } from "@/db/connection";
import { victims, aggressors, occurrences } from "@/db/schema";

export const getVictimReportCurrentMonth = new Elysia()
  .use(authentication)
  .get("/reports/victims/current-month", async () => {
    const count = await db
      .select({ count: sql`count(DISTINCT id)` })
      .from(victims)
      .where(sql`${victims.createdAt} >= DATE_TRUNC('month', NOW()) AND ${victims.createdAt} < DATE_TRUNC('month', NOW()) + INTERVAL '1 month'`);

    return { count: count[0].count };
  });

export const getAggressorReportCurrentMonth = new Elysia()
  .use(authentication)
  .get("/reports/aggressors/current-month", async () => {
    const count = await db
      .select({ count: sql`count(DISTINCT id)` })
      .from(aggressors)
      .where(sql`${aggressors.createdAt} >= DATE_TRUNC('month', NOW()) AND ${aggressors.createdAt} < DATE_TRUNC('month', NOW()) + INTERVAL '1 month'`);

    return { count: count[0].count };
  });

export const getOccurrenceReportCurrentMonth = new Elysia()
  .use(authentication)
  .get("/reports/occurrences/current-month", async () => {
    const count = await db
      .select({ count: sql`count(DISTINCT id)` })
      .from(occurrences)
      .where(sql`${occurrences.createdAt} >= DATE_TRUNC('month', NOW()) AND ${occurrences.createdAt} < DATE_TRUNC('month', NOW()) + INTERVAL '1 month'`);

    return { count: count[0].count };
  });