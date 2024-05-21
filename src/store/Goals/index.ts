import { create } from "zustand";
import uniqBy from "lodash/fp/uniqBy";
import remove from "lodash/remove";

import { GoalType, GoalsAPITypes, ProgressType, GoalTasksTypes } from "./api";
import { DATA_FETCHING_STATUS } from "../../types/status";
import { idType } from "../../types/idtype";

export interface GoalsStoreDefaultTypes {
  goals: GoalsAPITypes[];
  loadingGoals: DATA_FETCHING_STATUS;
  loadingTasks: DATA_FETCHING_STATUS;
  tempGoal: GoalsAPITypes;
  tempTask: string;
  tasks: GoalTasksTypes[];
}

export interface GoalsStoreTypes extends GoalsStoreDefaultTypes {
  fillGoals: (goals: GoalsAPITypes[]) => Promise<void>;
  updateLoadingGoals: (value: DATA_FETCHING_STATUS) => void;
  updateLoadingTasksGoals: (value: DATA_FETCHING_STATUS) => void;
  addNewGoal: (value: GoalsAPITypes) => void;
  removeGoal: (id: idType) => void;
  updateGoal: (goal: GoalsAPITypes) => void;
  setTempGoal: (value: GoalsAPITypes | null) => void;
  setTempGoalByKey: (key: string, value: string | number | null) => void;
  resetTempGoal: () => void;
  setTempTask: (value: string) => void;
  addNewGoalTask: (value: GoalTasksTypes) => void;
  fillTasks: (tasks: GoalTasksTypes[]) => Promise<void>;
  updateTask: (task: GoalTasksTypes) => void;
  removeGoalTask: (id: idType) => void;
}

export const GoalsStoreDefault: GoalsStoreDefaultTypes = {
  loadingGoals: DATA_FETCHING_STATUS.NODATA,
  loadingTasks: DATA_FETCHING_STATUS.NODATA,
  goals: [],
  tempGoal: {
    goalType: GoalType.SMART,
    progressType: ProgressType.TASKS_FINISHED,
  },
  tempTask: "",
  tasks: [],
};

export const useGoalsStore = create<GoalsStoreTypes>((set, get) => ({
  loadingGoals: GoalsStoreDefault.loadingGoals,
  loadingTasks: GoalsStoreDefault.loadingTasks,
  tempGoal: GoalsStoreDefault.tempGoal,
  setTempGoal: async (value) => {
    const tempGoal = await get().tempGoal;
    await set({
      tempGoal: {
        ...tempGoal,
        ...value,
      },
    });
  },
  setTempGoalByKey: async (key, value) => {
    const tempGoal = await get().tempGoal;

    await set({
      tempGoal: {
        ...tempGoal,
        [key]: value,
      },
    });
  },
  resetTempGoal: async () => {
    await set({
      tempGoal: GoalsStoreDefault.tempGoal,
    });
  },
  updateLoadingGoals: async (value) => {
    set({ loadingGoals: value });
  },
  updateLoadingTasksGoals: async (value) => {
    set({ loadingTasks: value });
  },
  goals: GoalsStoreDefault.goals,
  fillGoals: async (goals: GoalsAPITypes[]) => {
    const storedGoals = await get().goals;
    const newTasks = uniqBy((item) => item.goalId, storedGoals.concat(goals));

    await set({
      goals: newTasks,
    });
  },
  addNewGoal: async (value: GoalsAPITypes) => {
    const storedGoals = await get().goals;
    await set({
      goals: storedGoals.concat([
        {
          ...value,
        },
      ]),
    });
  },

  updateGoal: async (newGoalData: GoalsAPITypes) => {
    const storedGoals = await get().goals;
    const index = storedGoals.findIndex(
      (goal) => goal.goalId === newGoalData.goalId,
    );

    storedGoals[index] = {
      ...storedGoals[index],
      ...newGoalData,
    };

    await set({ goals: [...storedGoals] });
  },

  removeGoal: async (id: idType) => {
    const storedGoals = [...get().goals];
    remove(storedGoals, (goal) => goal.goalId === id);
    await set({ goals: [...storedGoals] });
  },

  tempTask: GoalsStoreDefault.tempTask,
  setTempTask: async (value) => {
    await set({
      tempTask: value,
    });
  },
  tasks: GoalsStoreDefault.tasks,
  addNewGoalTask: async (value: GoalTasksTypes) => {
    const storedTasks = await get().tasks;

    await set({
      tasks: [...storedTasks, { ...value }],
    });
  },
  fillTasks: async (tasks: GoalTasksTypes[]) => {
    const storedTasks = await get().tasks;
    const newTasks = uniqBy((item) => item.taskId, storedTasks.concat(tasks));

    await set({
      tasks: newTasks,
    });
  },
  updateTask: async (newTask: GoalTasksTypes) => {
    const storedTasks = await get().tasks;
    const index = storedTasks.findIndex(
      (task) => task.taskId === newTask.taskId,
    );

    storedTasks[index] = {
      ...storedTasks[index],
      ...newTask,
    };

    await set({ tasks: [...storedTasks] });
  },
  removeGoalTask: async (id: idType) => {
    const storedTasks = [...get().tasks];
    remove(storedTasks, (task) => task.taskId === id);
    await set({ tasks: [...storedTasks] });
  },
}));
