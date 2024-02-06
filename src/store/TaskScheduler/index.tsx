import { create } from "zustand";

export enum ScheduleTypes {
  "NO" = "no",
  "EVERY" = "every",
}

export type SchedulerTypes = {
  1: {
    label: ScheduleTypes.NO;
    key: number;
  };
  2: {
    label: ScheduleTypes.EVERY;
    key: number;
  };
};

export let SCHEDULER_TYPE: SchedulerTypes = {
  1: {
    label: ScheduleTypes.NO,
    key: 1,
  },
  2: {
    label: ScheduleTypes.EVERY,
    key: 2,
  },
};

export enum SchedulerPeriod {
  "WEEK" = "week",
  "WEEKS" = "weeks",
  "MONTH" = "month",
  "MONTHS" = "months",
  "YEAR" = "year",
  "YEARS" = "years",
}

export type SchedulerPeriodTypes = {
  1: {
    label: SchedulerPeriod.WEEK;
    labelPlural: SchedulerPeriod.WEEKS;
    key: number;
  };
  2: {
    label: SchedulerPeriod.MONTH;
    labelPlural: SchedulerPeriod.MONTHS;
    key: number;
  };
  3: {
    label: SchedulerPeriod.YEAR;
    labelPlural: SchedulerPeriod.YEARS;
    key: number;
  };
};

export let SCHEDULER_PERIOD: SchedulerPeriodTypes = {
  1: {
    label: SchedulerPeriod.WEEK,
    labelPlural: SchedulerPeriod.WEEKS,
    key: 1,
  },
  2: {
    label: SchedulerPeriod.MONTH,
    labelPlural: SchedulerPeriod.MONTHS,
    key: 2,
  },
  3: {
    label: SchedulerPeriod.YEAR,
    labelPlural: SchedulerPeriod.YEARS,
    key: 3,
  },
};

export interface TaskSchedulerStoreDefaultTypes {
  repeatType: SchedulerTypes["1"]["key"];
  repeatPeriod: SchedulerPeriodTypes["1"]["key"];
  repeatTimes: number;
}

export interface TaskSchedulerStoreTypes
  extends TaskSchedulerStoreDefaultTypes {
  repeatType: SchedulerTypes["1"]["key"];
  repeatPeriod: SchedulerPeriodTypes["1"]["key"];
  repeatTimes: number;
  setRepeatType: (value: number) => void;
  setRepeatPeriod: (value: number) => void;
  setRepeatTimes: (value: number) => void;
  resetScheduler: () => void;
}

export const TaskSchedulerStoreDefault: TaskSchedulerStoreDefaultTypes = {
  repeatType: SCHEDULER_TYPE["1"].key,
  repeatPeriod: SCHEDULER_PERIOD["1"].key,
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
