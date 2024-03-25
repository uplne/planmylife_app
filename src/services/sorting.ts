import dayjs from "dayjs";

import { TasksAPITypes } from "../store/Tasks/api";

export const sortByAssigned = (a: TasksAPITypes, b: TasksAPITypes): number =>
  dayjs(a.assigned).valueOf() - dayjs(b.assigned).valueOf();
