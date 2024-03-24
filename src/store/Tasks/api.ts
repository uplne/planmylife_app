import { idType } from "../../types/idtype";
import { StatusTypes, TasksTypes } from "../../types/status";
import { SchedulerType, SchedulerPeriod } from "../TaskScheduler";

export interface TasksAPITypes {
  id?: idType;
  taskId: idType;
  userId?: string;
  type: TasksTypes;
  status: StatusTypes;
  title: string;
  created: string | null;
  createdTimestamp: string | null;
  updated: string | null;
  assigned: string | null;
  assignedTimestamp: string | null;
  completed: string | null;
  moved: string[];
  schedule?: string | null;
  repeatType?: SchedulerType | null;
  repeatPeriod?: SchedulerPeriod | null;
  repeatTimes?: number | null;
  repeatCompletedForWeeks: string[];
  removedForWeek: string[];
}

/*
  CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task_id TEXT,
    user_id TEXT,
    type TEXT,
    status TEXT,
    title TEXT,
    created timestamp,
    created_timestamp timestamp,
    updated timestamp,
    assigned timestamp,
    assigned_timestamp timestamp,
    completed timestamp,
    moved timestamp[],
    schedule timestamp,
    repeat_type integer,
    repeat_period integer,
    repeat_times integer,
    repeat_completed_for_weeks timestamp[],
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
  );
*/
