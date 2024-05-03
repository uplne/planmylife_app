import { create } from "zustand";
import uniqBy from "lodash/fp/uniqBy";
import remove from "lodash/remove";

import { GoalType, GoalsAPITypes, ProgressType } from "./api";
import { DATA_FETCHING_STATUS } from "../../types/status";
import { idType } from "../../types/idtype";

export interface GoalsStoreDefaultTypes {
  goals: GoalsAPITypes[];
  loadingGoals: DATA_FETCHING_STATUS;
  tempGoal: GoalsAPITypes;
}

export interface GoalsStoreTypes extends GoalsStoreDefaultTypes {
  fillGoals: (goals: GoalsAPITypes[]) => Promise<void>;
  updateLoadingGoals: (value: DATA_FETCHING_STATUS) => void;
  addNewGoal: (value: GoalsAPITypes) => void;
  removeGoal: (id: idType) => void;
  updateGoal: (goal: GoalsAPITypes) => void;
  setTempGoal: (value: GoalsAPITypes | null) => void;
  setTempGoalByKey: (key: string, value: string | number | null) => void;
  resetTempGoal: () => void;
}

export const GoalsStoreDefault: GoalsStoreDefaultTypes = {
  loadingGoals: DATA_FETCHING_STATUS.NODATA,
  goals: [],
  tempGoal: {
    goalType: GoalType.SMART,
    progressType: ProgressType.TASKS_FINISHED,
  },
};

export const useGoalsStore = create<GoalsStoreTypes>((set, get) => ({
  loadingGoals: GoalsStoreDefault.loadingGoals,
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
}));
