import { z } from "zod";
import { occurrences, victims, aggressors } from "@/db/schema";
import { db } from "@/db/connection";
import Elysia from "elysia";
import { authentication } from "../authentication";
import { eq } from "drizzle-orm";

const occurrenceBodySchema = z.object({
  date: z.date().default(new Date()),
  time: z.enum(["manhã", "tarde", "noite"]),
  institute: z.string(),
  bond: z.string(),
  drugs: z.boolean(),
  type: z.string(),
  victimCpf: z.string(),
  aggressorCpf: z.string(),
});

export const createOccurrence = new Elysia()
  .use(authentication)
  .post("/occurrences", async ({ body, set }) => {
    try {
      const parsedBody = occurrenceBodySchema.parse(body);

      const victim = await db
        .select()
        .from(victims)
        .where(eq(victims.cpf, parsedBody.victimCpf))
        .then((victims) => victims[0]);
      const aggressor = await db
        .select()
        .from(aggressors)
        .where(eq(aggressors.cpf, parsedBody.aggressorCpf))
        .then((aggressors) => aggressors[0]);

      if (!victim || !aggressor) {
        throw new Error("Victim or aggressor not found");
      }
      const dateString = parsedBody.date.toISOString().split("T")[0];
      await db.insert(occurrences).values({
        date: dateString,
        time: parsedBody.time,
        institute: parsedBody.institute,
        bond: parsedBody.bond,
        drugs: parsedBody.drugs,
        type: parsedBody.type,
        victimId: victim.id,
        aggressorId: aggressor.id,
      });

      set.status = 201;
      return {
        message: "Occurrence created successfully",
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        set.status = 400;
        return {
          error: "Invalid request body",
          details: error.issues,
        };
      } else {
        set.status = 500;
        return {
          error: "Internal server error",
        };
      }
    }
  });
