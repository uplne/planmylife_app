import { Timestamp } from "../../services/firebase";

import { idType } from "../../types/idtype";
import { StatusTypes, TasksTypes } from "../../types/status";
import { SchedulerTypes, SchedulerPeriodTypes } from "../TaskScheduler";

export interface TasksAPITypes {
  id: idType;
  type: TasksTypes;
  status: StatusTypes;
  title: string;
  created: string | null;
  createdTimestamp: Timestamp | null;
  updated: string | null;
  assigned: string | null;
  assignedTimestamp: Timestamp | null;
  completed: string | null;
  moved: string[];
  schedule?: string | null;
  repeatType?: SchedulerTypes["1"]["key"] | null;
  repeatPeriod?: SchedulerPeriodTypes["1"]["key"] | null;
  repeatTimes?: number | null;
  repeatCompletedForWeeks: string[];
}
