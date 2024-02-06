import { create } from "zustand";
import dayjs from "dayjs";
import flow from "lodash/fp/flow";
import sortBy from "lodash/fp/sortBy";
import filter from "lodash/fp/filter";
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
  isLoading: DATA_FETCHING_STATUS;
  schedule: string | undefined;
}

export interface TasksStoreTypes extends TasksStoreDefaultTypes {
  tasks: TaskType[];
  newTask: string;
  fillTasks: (tasks: TaskType[]) => Promise<void>;
  isLoading: DATA_FETCHING_STATUS;
  updateIsLoading: (value: DATA_FETCHING_STATUS) => void;
  updateNewTask: (value: string) => void;
  schedule: string | undefined;
  setSchedule: (value: string | undefined) => void;
  addNewTask: (value: TaskType) => void;
  updateTask: (value: TaskType) => void;
  revertCompleted: (id: idType, recurringRevert?: boolean) => void;
  removeTask: (id: idType) => void;

  defaultTasksSelector: () => TaskType[];
  defaultCompletedTasks: () => TaskType[];
  allCompletedTasks: () => TaskType[];
}

export const TasksStoreDefault: TasksStoreDefaultTypes = {
  isLoading: DATA_FETCHING_STATUS.NODATA,
  tasks: [],
  newTask: "",
  schedule: undefined,
};

export const useTasksStore = create<TasksStoreTypes>((set, get) => ({
  isLoading: TasksStoreDefault.isLoading,
  updateIsLoading: async (value) => {
    set({ isLoading: value });
  },
  tasks: TasksStoreDefault.tasks,
  fillTasks: async (tasks: TaskType[]) => {
    const storedTasks = await get().tasks;
    const newTasks = uniqBy((item) => item.id, storedTasks.concat(tasks));
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
    const storedTasks = [...(await get().tasks)];
    const index = storedTasks.findIndex((task) => task.id === newTaskData.id);

    storedTasks[index] = {
      ...storedTasks[index],
      ...newTaskData,
    };

    await set({ tasks: storedTasks });
  },

  revertCompleted: async (id: idType, recurringRevert: boolean = false) => {
    const selectedWeekId = useWeekStore.getState().selectedWeekId;
    const storedTasks = await get().tasks;
    const index = storedTasks.findIndex((task) => task.id === id);
    const task = storedTasks[index];

    // Revert only one recurrence (for one week)
    if (
      "type" in task &&
      (task.type === TasksTypes.RECURRING ||
        task.type === TasksTypes.SCHEDULED_RECURRING) &&
      recurringRevert
    ) {
      const newArray = storedTasks[index].repeatCompletedForWeeks.filter(
        (week) => dayjs(week).isSame(dayjs(selectedWeekId), "week"),
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
    remove(storedTasks, (task) => task.id === id);
    await set({ tasks: storedTasks });
  },

  // Selectors - DEFAULT
  defaultTasksSelector: () => {
    const storedTasks = [...get().tasks];
    const selectedWeekId = useWeekStore.getState().selectedWeekId;

    const result = (
      flow(
        filter(
          (task: TaskType) =>
            task.type === TasksTypes.DEFAULT &&
            task.status === StatusTypes.ACTIVE &&
            dayjs(task.assigned).isSame(dayjs(selectedWeekId), "week"),
        ),
        sortBy((item: TaskType) => item.assigned),
      ) as FlowType
    )(storedTasks);

    return result;
  },

  // Completed

  // Completed - DEFAULT
  defaultCompletedTasks: () => {
    const storedTasks = get().tasks;
    const selectedWeekId = useWeekStore.getState().selectedWeekId;

    const result = (
      flow(
        filter(
          (task: TaskType) =>
            task.type === TasksTypes.DEFAULT &&
            task.status === StatusTypes.COMPLETED &&
            dayjs(task.assigned).isSame(dayjs(selectedWeekId), "week"),
        ),
        sortBy((item: TaskType) => item.assigned),
      ) as FlowType
    )(storedTasks);

    return result;
  },
  allCompletedTasks: () => {
    const defaultCompletedTasks = get().defaultCompletedTasks();

    const result = flow(sortBy("assigned"))([...defaultCompletedTasks]);

    return result;
  },
}));
