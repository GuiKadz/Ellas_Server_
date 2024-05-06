import { victims } from "@/db/schema";
import { db } from "@/db/connection";
import Elysia from "elysia";
import { z } from "zod";
import { authentication } from "../authentication";

const registerVictimBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  phone: z.string(),
  district: z.string(),
  address: z.string(),
  age: z.number(),
  profession: z.string(),
  maritalStatus: z.string(),
  ethnicity: z.string(),
  auxGov: z.string(),
  childrens: z.boolean(),
  income: z.any(),
  schooling: z.string(),
  disabled: z.boolean(),
});

export const registerVictims = new Elysia()
  .use(authentication)
  .post("/victims", async ({ body, set }) => {
    try {
      const parsedBody = registerVictimBodySchema.parse(body);

      await db.insert(victims).values(parsedBody);

      set.status = 201;
      return {
        message: "Victim registered successfully",
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
