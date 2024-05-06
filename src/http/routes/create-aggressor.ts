import { z } from "zod";
import { authentication } from "../authentication";
import Elysia from "elysia";
import { db } from "@/db/connection";
import { aggressors } from "@/db/schema";

const aggressorBodySchema = z.object({
  name: z.string(),
  cpf: z.string().length(11), // assuming CPF is 11 digits
  age: z.number().int(),
  ethnicity: z.string(),
  schooling: z.string(),
  substanceAddiction: z.boolean(),
  criminalRecord: z.boolean(),
});

export const registerAggressor = new Elysia()
 .use(authentication)
 .post("/aggressors", async ({ body, set }) => {
    try {
      const parsedBody = aggressorBodySchema.parse(body);

      await db.insert(aggressors).values(parsedBody)

      set.status = 201;
      return {
        message: "Aggressor registered successfully",
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