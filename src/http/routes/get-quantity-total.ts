import { sql } from 'drizzle-orm';
import Elysia from "elysia";
import { authentication} from "../authentication";
import { db } from "@/db/connection";
import { victims, aggressors, occurrences } from "@/db/schema";

export const getTotalVictimCount = new Elysia()
  .use(authentication)
  .get("/reports/victims/total", async () => {
    const count = await db
      .select({ count: sql`count(DISTINCT id)` })
      .from(victims);

    return { count: count[0].count };
  });

export const getTotalAggressorCount = new Elysia()
  .use(authentication)
  .get("/reports/aggressors/total", async () => {
    const count = await db
      .select({ count: sql`count(DISTINCT id)` })
      .from(aggressors);

    return { count: count[0].count };
  });

export const getTotalOccurrenceCount = new Elysia()
  .use(authentication)
  .get("/reports/occurrences/total", async () => {
    const count = await db
      .select({ count: sql`count(DISTINCT id)` })
      .from(occurrences);

    return { count: count[0].count };
  });