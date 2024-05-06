import { createId } from "@paralleldrive/cuid2";
import {
  text,
  timestamp,
  integer,
  boolean,
  pgTable,
} from "drizzle-orm/pg-core";
import { occurrences } from "./occurrence";
import { relations } from "drizzle-orm";

export const victims = pgTable("victims", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  cpf: text("cpf").notNull().unique(),
  phone: text("phone").unique(),
  district: text("district").notNull(),
  address: text("address").notNull(),
  age: integer("age"),
  profession: text("profession"),
  maritalStatus: text("marital_status"),
  ethnicity: text("ethnicity"),
  auxGov: text("aux-gov"),
  childrens: boolean("childrens"),
  income: integer("income"),
  schooling: text("schooling"),
  disabled: boolean("disabled"),
  createdAt: timestamp("created_at").defaultNow(),
});



export const victimsRelations = relations(victims, ({ many }) => ({
  occurrence: many(occurrences),
}));
