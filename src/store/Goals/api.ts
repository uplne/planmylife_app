import { idType } from "../../types/idtype";
import { StatusTypes, GoalAssignmentTypes } from "../../types/status";
import { SchedulerTypeKey, SchedulerPeriodKey } from "../HabitScheduler";

export enum ProgressType {
  "TASKS_FINISHED",
  "OWN",
}

export enum GoalType {
  "SMART",
  "OKR",
}

export interface GoalsAPITypes {
  id?: idType;
  goalId?: idType;
  userId?: string;
  categoryId?: idType;
  keyId?: idType;
  goalType?: GoalType;
  status?: StatusTypes;
  objective?: string;
  moved?: string[];
  created?: string | null;
  updated?: string | null;
  assigned?: string | null;
  assignment?: GoalAssignmentTypes;
  completed?: string | null;
  why?: string;
  // Type of habit - every | at least
  habitRepeatType?: SchedulerTypeKey | null;
  // How often - day | working days | selected days
  habitRepeatPeriod?: SchedulerPeriodKey | null;
  // How often for at least - at least x days
  habitRepeatTimes?: number | null;
  // Actual days when we want it for every - for days [0,1,2,3,4,5,6], for working days [0,1,2,3,4] etc
  habitRepeatDays?: number[] | null;
  // Dates of completed habit
  habitCompletedDays?: string[] | null;

  startDate?: string | null;
  endDate?: string | null;
  progressType?: ProgressType;
  progressPercent?: number | null;
  progressOwnValue?: string | null;
  progressOwnUnits?: string | null;
}

export interface GoalTasksTypes {
  id?: idType;
  goalId?: idType;
  userId?: string;
  taskId?: idType;
  status?: StatusTypes;
  assignment?: GoalAssignmentTypes;
  moved?: string[];
  subtasks: GoalSubTasksTypes[];
  title?: string;
  created?: string | null;
  updated?: string | null;
  assigned?: string | null;
  completed?: string | null;
}

export interface GoalSubTasksTypes {
  id?: idType;
  goalId?: idType;
  userId?: string;
  taskId?: idType;
  subtaskId?: idType;
  status?: StatusTypes;
  title?: string;
  created?: string | null;
  updated?: string | null;
  completed?: string | null;
}

/*
  CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    goal_id TEXT,
    user_id TEXT,
    category_id TEXT,
    type TEXT,
    status TEXT,
    objective TEXT,
    created timestamp,
    updated timestamp,
    assigned timestamp,
    completed timestamp,
    why TEXT,
    UNIQUE(goal_id)
  );

  CREATE TABLE smart_goals (
    id SERIAL PRIMARY KEY,
    goal_id TEXT,
    user_id TEXT,
    key_id TEXT,
    start_date timestamp,
    end_date timestamp,
    progress_type smallint,
    progress_percent smallint,
    progress_own_value TEXT,
    progress_own_units TEXT,
    FOREIGN KEY (goal_id) REFERENCES goals(goal_id) ON DELETE CASCADE
  );

  CREATE TABLE key_results (
    id SERIAL PRIMARY KEY,
    goal_id TEXT,
    user_id TEXT,
    key_id TEXT,
    start_date timestamp,
    end_date timestamp,
    progress_type smallint,
    progress_percent smallint,
    progress_own_value TEXT,
    progress_own_units TEXT,
    FOREIGN KEY (goal_id) REFERENCES goals(goal_id) ON DELETE CASCADE
  );

  CREATE TABLE goal_tasks (
    id SERIAL PRIMARY KEY,
    goal_id TEXT,
    key_id TEXT,
    task_id TEXT,
    user_id TEXT,
    title TEXT,
    status TEXT,
    created timestamp,
    updated timestamp,
    assigned timestamp,
    completed timestamp,
    UNIQUE(task_id)
  );

  CREATE TABLE goal_subtasks (
    id SERIAL PRIMARY KEY,
    goal_id TEXT,
    key_id TEXT,
    task_id TEXT,
    subtask_id TEXT,
    user_id TEXT,
    title TEXT,
    status TEXT,
    UNIQUE(task_id)
  );
*/
