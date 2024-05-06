import { createId } from "@paralleldrive/cuid2";
import { text, integer, pgTable, boolean, timestamp } from "drizzle-orm/pg-core";
import { occurrences } from "./occurrence";
import { relations } from "drizzle-orm";

export const aggressors = pgTable("aggressors", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  cpf: text("cpf").unique().notNull(),
  age: integer("age"),
  ethnicity: text("ethnicity"),
  schooling: text("schooling"),
  substanceAddiction: boolean("substance_addiction"),
  criminalRecord: boolean("criminal_record"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aggressorsRelations = relations(aggressors, ({ many }) => ({
  occurrences: many(occurrences),
}));
