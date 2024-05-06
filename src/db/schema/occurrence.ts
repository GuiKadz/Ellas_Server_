import { createId } from "@paralleldrive/cuid2";
import { timestamp, pgEnum, text, boolean, pgTable, date } from "drizzle-orm/pg-core";
import { victims, aggressors} from ".";
import { relations } from "drizzle-orm";

export const timeDayEnum = pgEnum('time_day', ['manhã','tarde','noite'])

export const occurrences = pgTable('occurrences', {
    id: text('id')
        .$defaultFn(()=> createId())
        .primaryKey(),
    date: date('date'),
    time: timeDayEnum('time'),
    institute: text('institute').notNull(),
    bond: text('bond'),
    drugs: boolean('drugs'),
    description: text("description"),
    type: text('type'),
    victimId: text('victim').references(()=> victims.id),
    aggressorId: text('aggressor').references(()=>aggressors.id),
    createdAt: timestamp('created_at').defaultNow(),
})

export const occurrencesRelations = relations(occurrences, ({ one }) => ({
    victim: one(victims, {
      fields: [occurrences.victimId],
      references: [victims.id],
    }),
    aggressor: one(aggressors, {
      fields: [occurrences.aggressorId],
      references: [aggressors.id],
    }),
  }))