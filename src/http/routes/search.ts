import { victims, occurrences } from "@/db/schema";
import { db } from "@/db/connection";
import Elysia from "elysia";
import { z } from "zod";
import { authentication } from "../authentication";
import { eq, or } from "drizzle-orm";

const searchQuerySchema = z.string();

export const searchVictimsAndAggressors = new Elysia()
  .use(authentication)
  .post("/search/:query", async ({ params, set }) => {
    try {
      const parsedQuery = searchQuerySchema.parse(params.query);

      let search: any[] = [];

      search = await db
        .select()
        .from(victims)
        .where(
          or(eq(victims.phone, parsedQuery), eq(victims.cpf, parsedQuery))
        );

      if (search.length === 0) {
        search = [];
      }

      const occurrencesData = await db
        .select()
        .from(occurrences)
        .where(
          or(
            eq(occurrences.victimId, search[0]?.id),
            eq(occurrences.aggressorId, search[0]?.id)
          )
        );

      search = search.map((victim) => {
        return {
          ...victim,
          occurrences: occurrencesData.filter(
            (occurrence) =>
              occurrence.victimId === victim.id ||
              occurrence.aggressorId === victim.id
          ),
        };
      });

      if (search.length === 0) {
        set.status = 404;
        return {
          error: "Victim and aggressor not found",
        };
      } else {
        set.status = 200;
        return {
          search,
        };
      }
    } catch (error) {
      set.status = 401;
      return "Error internal"
    }
  });