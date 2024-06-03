import { create } from "zustand";
import uniqBy from "lodash/fp/uniqBy";
import remove from "lodash/remove";

import {
  GoalType,
  GoalsAPITypes,
  ProgressType,
  GoalTasksTypes,
  GoalSubTasksTypes,
} from "./api";
import { DATA_FETCHING_STATUS } from "../../types/status";
import { idType } from "../../types/idtype";
import { uuidv4 } from "@firebase/util";

export interface GoalsStoreDefaultTypes {
  goals: GoalsAPITypes[];
  loadingGoals: DATA_FETCHING_STATUS;
  loadingTasks: DATA_FETCHING_STATUS;
  tempGoal: GoalsAPITypes;
  tempTask: string;
  tasks: GoalTasksTypes[];
  subtasks: GoalSubTasksTypes[];
  tempSubTasks: Map<idType, GoalSubTasksTypes>;
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

  // Tasks
  setTempTask: (value: string) => void;
  addNewGoalTask: (value: GoalTasksTypes) => void;
  fillTasks: (tasks: GoalTasksTypes[]) => Promise<void>;
  updateTask: (task: GoalTasksTypes) => void;
  removeGoalTask: (id: idType) => void;

  // Subtasks
  setTempSubTask: (id: idType, value: string) => void;
  updateTempSubTask: (id: idType, value: string) => void;
  eraseTempSubTask: () => void;
  fillTempSubTask: (tasks: GoalSubTasksTypes[]) => void;
  addNewGoalSubTask: (value: GoalSubTasksTypes) => void;
  fillSubTasks: (tasks: GoalSubTasksTypes[]) => Promise<void>;
  updateSubTask: (task: GoalSubTasksTypes) => void;
  removeGoalSubTask: (task: GoalSubTasksTypes) => void;
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
  tempSubTasks: new Map(),
  tasks: [],
  subtasks: [],
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

  // Tasks
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

  // Subtasks
  subtasks: GoalsStoreDefault.subtasks,
  tempSubTasks: GoalsStoreDefault.tempSubTasks,
  setTempSubTask: async (id, value) => {
    const storedSubTasks = await get().tempSubTasks;

    if (storedSubTasks.has(id)) {
      const item = storedSubTasks.get(id);
      storedSubTasks.set(id, {
        ...item,
        title: value,
      });
    } else {
      const newId = uuidv4();
      const newItem = {
        id: newId,
        title: value,
      };
      storedSubTasks.set(newId, newItem);
    }

    await set({
      tempSubTasks: storedSubTasks,
    });
  },
  updateTempSubTask: async (id, value) => {
    const storedSubTasks = await get().tempSubTasks;

    if (storedSubTasks.has(id)) {
      const item = storedSubTasks.get(id);
      storedSubTasks.delete(id);
      storedSubTasks.set(id, {
        ...item,
        title: value,
      });
    }

    await set({
      tempSubTasks: storedSubTasks,
    });
  },
  fillTempSubTask: async (tasks) => {
    const storedSubTasks = await get().tempSubTasks;

    tasks.forEach((subtask) => {
      if (!storedSubTasks.has(subtask.subtaskId!)) {
        storedSubTasks.set(subtask.subtaskId!, subtask);
      }
    });

    await set({
      tempSubTasks: storedSubTasks,
    });
  },
  eraseTempSubTask: async () => {
    const storedSubTasks = await get().tempSubTasks;

    storedSubTasks.clear();
    await set({
      tempSubTasks: storedSubTasks,
    });
  },
  addNewGoalSubTask: async (value: GoalSubTasksTypes) => {
    const storedTasks = await get().subtasks;

    // await set({
    //   tasks: [...storedTasks, { ...value }],
    // });
  },
  fillSubTasks: async (tasks: GoalSubTasksTypes[]) => {
    const storedTasks = await get().tasks;
    const indexTask = storedTasks.findIndex(
      (task) => task.taskId === tasks[0].taskId,
    );

    tasks.forEach((subtask) => {
      storedTasks[indexTask].subtasks.push(subtask);
    });

    storedTasks[indexTask] = {
      ...storedTasks[indexTask],
    };

    await set({ tasks: [...storedTasks] });
  },
  updateSubTask: async (newTask: GoalSubTasksTypes) => {
    const storedTasks = await get().tasks;
    const indexTask = storedTasks.findIndex(
      (task) => task.taskId === newTask.taskId,
    );

    const indexSubTask = storedTasks[indexTask].subtasks.findIndex(
      (subtask) => subtask.subtaskId === newTask.subtaskId,
    );

    storedTasks[indexTask].subtasks[indexSubTask] = {
      ...newTask,
    };

    storedTasks[indexTask] = {
      ...storedTasks[indexTask],
    };

    await set({ tasks: [...storedTasks] });
  },
  removeGoalSubTask: async (passedSubtask: GoalSubTasksTypes) => {
    const storedTasks = await get().tasks;
    const indexTask = storedTasks.findIndex(
      (task) => task.taskId === passedSubtask.taskId,
    );

    const indexSubTask = storedTasks[indexTask].subtasks.findIndex(
      (subtask) => subtask.subtaskId === passedSubtask.subtaskId,
    );

    delete storedTasks[indexTask].subtasks[indexSubTask];

    storedTasks[indexTask] = {
      ...storedTasks[indexTask],
    };

    await set({ tasks: [...storedTasks] });
  },
}));
