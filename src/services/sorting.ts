import dayjs from "dayjs";

export const sortByAssigned = <T extends { assigned: string | null }>(
  a: T,
  b: T,
): number => dayjs(a.assigned).valueOf() - dayjs(b.assigned).valueOf();
