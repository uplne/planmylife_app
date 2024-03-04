import { create } from "zustand";

export enum SchedulerType {
  "no",
  "every",
}

export type SchedulerTypeLabelTypes = {
  [key in SchedulerType]: {
    label: string;
    key: key;
  };
};

export const SCHEDULER_TYPE = {
  0: {
    label: SchedulerType[SchedulerType.no],
    key: 0,
  },
  1: {
    label: SchedulerType[SchedulerType.every],
    key: 1,
  },
};

export enum SchedulerPeriod {
  "week",
  "month",
  "year",
}

export type SchedulerPeriodLabelTypes = {
  [key in SchedulerPeriod]: {
    label: string;
    labelPlural: string;
    key: key;
  };
};

export let SCHEDULER_PERIOD_LABEL: SchedulerPeriodLabelTypes = {
  0: {
    label: SchedulerPeriod[SchedulerPeriod.week],
    labelPlural: "weeks",
    key: 0,
  },
  1: {
    label: SchedulerPeriod[SchedulerPeriod.month],
    labelPlural: "months",
    key: 1,
  },
  2: {
    label: SchedulerPeriod[SchedulerPeriod.year],
    labelPlural: "years",
    key: 2,
  },
};

export interface TaskSchedulerStoreDefaultTypes {
  repeatType: SchedulerType;
  repeatPeriod: SchedulerPeriod;
  repeatTimes: number;
}

export interface TaskSchedulerStoreTypes
  extends TaskSchedulerStoreDefaultTypes {
  repeatType: SchedulerType;
  repeatPeriod: SchedulerPeriod;
  repeatTimes: number;
  setRepeatType: (value: number) => void;
  setRepeatPeriod: (value: number) => void;
  setRepeatTimes: (value: number) => void;
  resetScheduler: () => void;
}

export const TaskSchedulerStoreDefault: TaskSchedulerStoreDefaultTypes = {
  repeatType: SchedulerType.no,
  repeatPeriod: SchedulerPeriod.week,
  repeatTimes: 1,
};

export const useTaskSchedulerStore = create<TaskSchedulerStoreTypes>((set) => ({
  repeatType: TaskSchedulerStoreDefault.repeatType,
  repeatPeriod: TaskSchedulerStoreDefault.repeatPeriod,
  repeatTimes: TaskSchedulerStoreDefault.repeatTimes,

  setRepeatType: async (value: number) => {
    await set({ repeatType: value });
  },
  setRepeatPeriod: async (value: number) => {
    await set({ repeatPeriod: value });
  },
  setRepeatTimes: async (value: number) => {
    await set({ repeatTimes: value });
  },
  resetScheduler: async () => {
    await set({
      repeatType: TaskSchedulerStoreDefault.repeatType,
      repeatPeriod: TaskSchedulerStoreDefault.repeatPeriod,
      repeatTimes: TaskSchedulerStoreDefault.repeatTimes,
    });
  },
}));
