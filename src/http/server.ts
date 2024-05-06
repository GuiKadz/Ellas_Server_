import { getProfile } from "./routes/get-profile";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { authentication } from "./authentication";
import { registerInstitute } from "./routes/create-user";
import { sendAuthetincationLink } from "./routes/send-authentication-link";
import { authenticateFromLink } from "./routes/authenticate-from-link";
import { signOut } from "./routes/sign-out";
import { registerVictims } from "./routes/create-victim";
import {
  getAggressorReport,
  getOccurrenceReport,
  getVictimReport,
} from "./routes/get-metrics-details";
import {
  getAggressorReportCurrentMonth,
  getOccurrenceReportCurrentMonth,
  getVictimReportCurrentMonth,
} from "./routes/get-month-quantity";
import { getOccurencesAmount } from "./routes/get-difference-from-previous-month";
import {
  getTotalAggressorCount,
  getTotalOccurrenceCount,
  getTotalVictimCount,
} from "./routes/get-quantity-total";
import { updateProfile } from "./routes/update-profile";
import { searchVictimsAndAggressors } from "./routes/search";
import { getReportInPeriod } from "./routes/get-report-in-period";
import { registerAggressor } from "./routes/create-aggressor";

const app = new Elysia()
  .use(
    cors({
      credentials: true,
      allowedHeaders: ["content-type"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
      origin: (request): boolean => {
        const origin = request.headers.get("origin");

        if (!origin) {
          return false;
        }

        return true;
      },
    })
  )
  .use(authentication)
  .use(registerInstitute)
  .use(sendAuthetincationLink)
  .use(authenticateFromLink)
  .use(signOut)
  .use(getProfile)
  .use(getAggressorReport)
  .use(registerVictims)
  .use(getAggressorReportCurrentMonth)
  .use(getOccurencesAmount)
  .use(getOccurrenceReport)
  .use(getTotalAggressorCount)
  .use(getVictimReport)
  .use(getOccurrenceReportCurrentMonth)
  .use(getTotalOccurrenceCount)
  .use(getTotalVictimCount)
  .use(getVictimReportCurrentMonth)
  .use(updateProfile)
  .use(searchVictimsAndAggressors)
  .use(getReportInPeriod)
  .use(registerAggressor)
  .onError(({ code, error, set }) => {
    switch (code) {
      case "VALIDATION": {
        set.status = error.status;

        return error.toResponse();
      }
      case "NOT_FOUND": {
        return new Response(null, { status: 404 });
      }
      default: {
        console.error(error);

        return new Response(null, { status: 500 });
      }
    }
  });

app.listen(3333);

console.log(
  `🔥 HTTP server running at ${app.server?.hostname}:${app.server?.port}`
);
