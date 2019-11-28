import { format } from "date-fns";

export const yearFirstDate = (date: Date = new Date()) => format(date, "yyyy-MM-dd");

export const getIsoStringDate = (isoString: string) => isoString.split("T")[0];

export const getISOHour = (isoDate: string): string => isoDate.split("T")[1].split("Z")[0];
