import { idType } from "../../types/idtype";
import { StatusTypes } from "../../types/status";

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
  created?: string | null;
  updated?: string | null;
  assigned?: string | null;
  completed?: string | null;
  why?: string;

  startDate?: string | null;
  endDate?: string | null;
  progressType?: ProgressType;
  progressPercent?: number | null;
  progressOwnValue?: string | null;
  progressOwnUnits?: string | null;
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
    UNIQUE(task_id),
    FOREIGN KEY (goal_id) REFERENCES goals(goal_id) ON DELETE CASCADE
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
    FOREIGN KEY (task_id) REFERENCES goal_tasks(task_id) ON DELETE CASCADE
  );
*/
