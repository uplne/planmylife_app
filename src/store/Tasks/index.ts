import { create } from "zustand";
import dayjs from "dayjs";
import uniqBy from "lodash/fp/uniqBy";
import remove from "lodash/remove";

import { useWeekStore } from "../Week";
import { TasksAPITypes } from "./api";
import {
  DATA_FETCHING_STATUS,
  TasksTypes,
  StatusTypes,
} from "../../types/status";
import { idType } from "../../types/idtype";

export type TaskType = TasksAPITypes;
export type FlowType = (tasks: TaskType[]) => TaskType[];

export interface TasksStoreDefaultTypes {
  tasks: TaskType[];
  newTask: string;
  loadingDefaultTasksStatus: DATA_FETCHING_STATUS;
  loadingRecurringTasksStatus: DATA_FETCHING_STATUS;
  schedule: string | undefined;
}

export interface TasksStoreTypes extends TasksStoreDefaultTypes {
  tasks: TaskType[];
  newTask: string;
  fillTasks: (tasks: TaskType[]) => Promise<void>;
  loadingDefaultTasksStatus: DATA_FETCHING_STATUS;
  updateLoadingDefaultTasksStatus: (value: DATA_FETCHING_STATUS) => void;
  loadingRecurringTasksStatus: DATA_FETCHING_STATUS;
  updateLoadingRecurringTasksStatus: (value: DATA_FETCHING_STATUS) => void;
  updateNewTask: (value: string) => void;
  schedule: string | undefined;
  setSchedule: (value: string | undefined) => void;
  addNewTask: (value: TaskType) => void;
  updateTask: (value: TaskType) => void;
  revertCompleted: (id: idType, recurringRevert?: boolean) => void;
  removeTask: (id: idType) => void;
}

export const TasksStoreDefault: TasksStoreDefaultTypes = {
  loadingDefaultTasksStatus: DATA_FETCHING_STATUS.NODATA,
  loadingRecurringTasksStatus: DATA_FETCHING_STATUS.NODATA,
  tasks: [],
  newTask: "",
  schedule: undefined,
};

export const useTasksStore = create<TasksStoreTypes>((set, get) => ({
  loadingDefaultTasksStatus: TasksStoreDefault.loadingDefaultTasksStatus,
  updateLoadingDefaultTasksStatus: async (value) => {
    set({ loadingDefaultTasksStatus: value });
  },
  loadingRecurringTasksStatus: TasksStoreDefault.loadingRecurringTasksStatus,
  updateLoadingRecurringTasksStatus: async (value) => {
    set({ loadingRecurringTasksStatus: value });
  },
  tasks: TasksStoreDefault.tasks,
  fillTasks: async (tasks: TaskType[]) => {
    const storedTasks = await get().tasks;
    const newTasks = uniqBy((item) => item.taskId, storedTasks.concat(tasks));

    await set({
      tasks: newTasks,
    });
  },

  // New task
  newTask: TasksStoreDefault.newTask,
  updateNewTask: async (value: string) => {
    await set({ newTask: value });
  },
  addNewTask: async (value: TaskType) => {
    const storedTasks = await get().tasks;
    await set({
      tasks: storedTasks.concat([
        {
          ...value,
        },
      ]),
    });
  },

  // Scheduling
  schedule: TasksStoreDefault.schedule,
  setSchedule: async (value: string | undefined) => {
    await set({ schedule: value });
  },

  updateTask: async (newTaskData: TaskType) => {
    const storedTasks = await get().tasks;
    const index = storedTasks.findIndex(
      (task) => task.taskId === newTaskData.taskId,
    );

    storedTasks[index] = {
      ...storedTasks[index],
      ...newTaskData,
    };

    await set({ tasks: [...storedTasks] });
  },

  revertCompleted: async (id: idType, recurringRevert: boolean = false) => {
    const selectedWeek = useWeekStore.getState().selectedWeek;
    const storedTasks = await get().tasks;
    const index = storedTasks.findIndex((task) => task.taskId === id);
    const task = storedTasks[index];

    // Revert only one recurrence (for one week)
    if (
      "type" in task &&
      (task.type === TasksTypes.RECURRING ||
        task.type === TasksTypes.SCHEDULED_RECURRING) &&
      recurringRevert
    ) {
      const newArray = storedTasks[index].repeatCompletedForWeeks.filter(
        (week) => dayjs(week).isSame(dayjs(selectedWeek), "week"),
      );
      storedTasks[index].repeatCompletedForWeeks = newArray;
      // Revert completed
    } else {
      storedTasks[index].status = StatusTypes.ACTIVE;
      storedTasks[index].completed = "";
    }

    await set({ tasks: storedTasks });
  },

  removeTask: async (id: idType) => {
    const storedTasks = [...get().tasks];
    remove(storedTasks, (task) => task.taskId === id);
    await set({ tasks: [...storedTasks] });
  },
}));
