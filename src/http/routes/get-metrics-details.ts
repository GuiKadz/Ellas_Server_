import Elysia from "elysia";
import { authentication } from "../authentication";
import { sql, } from "drizzle-orm";
import { db } from "@/db/connection";
import { victims, aggressors, occurrences } from "@/db/schema";

export const getVictimReport = new Elysia().get(
  "/reports/victims",
  async () => {
    const victimReport = await db
      .select({
        district: sql<{
          [key: string]: number;
        }>`jsonb_each(${victims.district}::jsonb) AS district`,
        ethnicity: sql<{
          [key: string]: number;
        }>`jsonb_each(${victims.ethnicity}::jsonb) AS ethnicity`,
        age: sql<{
          [key: string]: number;
        }>`jsonb_each(${victims.age}::jsonb) AS age`,
        maritalStatus: sql<{
          [key: string]: number;
        }>`jsonb_each(${victims.maritalStatus}::jsonb) AS maritalStatus`,
        schooling: sql<{
          [key: string]: number;
        }>`jsonb_each(${victims.schooling}::jsonb) AS schooling`,
        disabled: sql<{
          [key: string]: number;
        }>`jsonb_each(${victims.disabled}::jsonb) AS disabled`,
      })
      .from(victims)
      .groupBy(
        sql`district`,
        sql`ethnicity`,
        sql`age`,
        sql`maritalStatus`,
        sql`schooling`,
        sql`disabled`
      );
      return {
        victim: victimReport.reduce((acc: any, current: any) => {
          acc[current.field] = acc[current.field] || {};
          acc[current.field][current.subField] =
            (acc[current.field][current.subField] || 0) + 1;
          return acc;
        }, {}),
}}
);

export const getAggressorReport = new Elysia().get(
  "/reports/aggressors",
  async () => {
    const aggressorReport = await db
      .select({
        age: sql<{
          [key: string]: number;
        }>`jsonb_each_text(${aggressors.age}).value AS age, count(*) AS count`,
        ethnicity: sql<{
          [key: string]: number;
        }>`jsonb_each_text(${aggressors.ethnicity}).value AS ethnicity, count(*) AS count`,
        schooling: sql<{
          [key: string]: number;
        }>`jsonb_each_text(${aggressors.schooling}).value AS schooling, count(*) AS count`,
        substanceAddiction: sql<{
          [key: string]: number;
        }>`jsonb_each_text(${aggressors.substanceAddiction}).value AS substanceAddiction, count(*) AS count`,
        criminalRecord: sql<{
          [key: string]: number;
        }>`jsonb_each_text(${aggressors.criminalRecord}).value AS criminalRecord, count(*) AS count`,
      })
      .from(aggressors)
      .groupBy(
        sql`age`,
        sql`ethnicity`,
        sql`schooling`,
        sql`substanceAddiction`,
        sql`criminalRecord`
      );

    return {
      aggressor: aggressorReport.reduce((acc: any, current: any) => {
        acc[current.field] = acc[current.field] || {};
        acc[current.field][current.subField] =
          (acc[current.field][current.subField] || 0) + 1;
        return acc;
      }, {}),
    };
  }
);

export const getOccurrenceReport = new Elysia().get(
  "/reports/occurrences",
  async () => {
    const occurrenceReport = await db
      .select({
        type: sql<{
          [key: string]: number;
        }>`jsonb_each_text(${occurrences.type}).value AS type, count(*) AS count`,
        date: sql<{
          [key: string]: number;
        }>`jsonb_each_text(${occurrences.date}).value AS date, count(*) AS count`,
        time: sql<{
          [key: string]: number;
        }>`jsonb_each_text(${occurrences.time}).value AS time, count(*) AS count`,
        institute: sql<{
          [key: string]: number;
        }>`jsonb_each_text(${occurrences.institute}).value AS institute, count(*) AS count`,
        bond: sql<{
          [key: string]: number;
        }>`jsonb_each_text(${occurrences.bond}).value AS bond, count(*) AS count`,
        drugs: sql<{
          [key: string]: number;
        }>`jsonb_each_text(${occurrences.drugs}).value AS drugs, count(*) AS count`,
      })
      .from(occurrences)
      .groupBy(
        sql`type`,
        sql`date`,
        sql`time`,
        sql`institute`,
        sql`bond`,
        sql`drugs`
      );

    return {
      occurrences: occurrenceReport.reduce((acc: any, current: any) => {
        acc[current.field] = acc[current.field] || {};
        acc[current.field][current.subField] =
          (acc[current.field][current.subField] || 0) + 1;
        return acc;
      }, {}),
    };
  }
);
