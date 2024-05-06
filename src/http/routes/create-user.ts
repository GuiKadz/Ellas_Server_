import { users } from "@/db/schema";
import { db } from "@/db/connection";
import Elysia from "elysia";
import { z } from "zod";

const registerInstituteBodySchema = z.object({
    institute: z.string().min(1),
    email: z.string().email(),
    phone: z.string(),
    city: z.string(),
})

export const registerInstitute = new Elysia().post(
    '/instituitions',
    async ({body, set}) => {
        const {institute, email, city, phone} = registerInstituteBodySchema.parse(body);

        await db.insert(users).values({
            institute,
            email,
            phone,
            city
        })
            
        set.status = 401
    }
)