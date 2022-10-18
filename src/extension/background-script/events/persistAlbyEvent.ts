import db from "~/extension/background-script/db";
import {
  DbAlbyEvent,
  LNURLAuthServiceResponse,
  AlbyEventType,
  AlbyEventBudgetUpdateDetails,
} from "~/types";

export const persistAlbyEvent = async (
  _message: "albyEvent.auth" | "albyEvent.budget.update" | "albyEvent.invoice",
  data: {
    event: AlbyEventType;
    details: LNURLAuthServiceResponse | AlbyEventBudgetUpdateDetails;
  }
) => {
  const { details, event } = data;

  const dbAlbyEvent: DbAlbyEvent = {
    createdAt: Date.now().toString(),
    event,
    details: JSON.stringify(details),
  };

  await db.albyEvents.add(dbAlbyEvent);
};