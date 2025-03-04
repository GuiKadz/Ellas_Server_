import { createId } from "@paralleldrive/cuid2";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum('user_role', ['admin', 'user'])

export const users = pgTable('users', {
    id: text('id')
        .$defaultFn(()=> createId())
        .primaryKey(),
    institute: text('institute').notNull(),
    email: text('email').notNull().unique(),
    phone: text('phone').unique(),
    city: text('city').notNull(),
    role: userRoleEnum('role').default('user').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
})