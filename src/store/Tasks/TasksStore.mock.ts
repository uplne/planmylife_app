import dayjs from "dayjs";

import { TaskType } from "../../store/Tasks";
import { StatusTypes, TasksTypes } from "../../types/status";

export const mockedTaskDataDefault: TaskType[] = [
  {
    id: "id_default_1",
    type: TasksTypes.DEFAULT,
    status: StatusTypes.ACTIVE,
    title: "Test task 1",
    created: null,
    createdTimestamp: null,
    updated: null,
    assigned: dayjs().format(),
    assignedTimestamp: null,
    completed: null,
    moved: [],
    schedule: dayjs().format(),
    repeatCompletedForWeeks: [],
  },
  {
    id: "id_default_2",
    type: TasksTypes.DEFAULT,
    status: StatusTypes.ACTIVE,
    title: "Test task 2",
    created: null,
    createdTimestamp: null,
    updated: null,
    assigned: dayjs().format(),
    assignedTimestamp: null,
    completed: null,
    moved: [],
    schedule: dayjs().format(),
    repeatCompletedForWeeks: [],
  },
];

export const mockedTaskDataDefaultCompleted: TaskType[] = [
  {
    id: "id2",
    type: TasksTypes.DEFAULT,
    status: StatusTypes.COMPLETED,
    title: "Test task 2",
    created: null,
    createdTimestamp: null,
    updated: null,
    assigned: dayjs().format(),
    assignedTimestamp: null,
    completed: null,
    moved: [],
    schedule: dayjs().format(),
    repeatCompletedForWeeks: [],
  },
];
