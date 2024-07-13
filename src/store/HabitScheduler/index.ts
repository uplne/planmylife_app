import { create } from "zustand";

export enum SchedulerPeriod {
  Day = "day",
  WorkingDay = "working day",
  SelectedDay = "selected day",
}

export enum SchedulerPeriodKey {
  Day = 0,
  WorkingDay = 1,
  SelectedDay = 2,
}

export interface SchedulerOption {
  title: SchedulerPeriod;
  key: SchedulerPeriodKey;
}

export type SchedulerOptions = {
  [key in SchedulerPeriodKey]: SchedulerOption;
};

export const SCHEDULER_OPTIONS: SchedulerOptions = {
  [SchedulerPeriodKey.Day]: {
    title: SchedulerPeriod.Day,
    key: SchedulerPeriodKey.Day,
  },
  [SchedulerPeriodKey.WorkingDay]: {
    title: SchedulerPeriod.WorkingDay,
    key: SchedulerPeriodKey.WorkingDay,
  },
  [SchedulerPeriodKey.SelectedDay]: {
    title: SchedulerPeriod.SelectedDay,
    key: SchedulerPeriodKey.SelectedDay,
  },
};

export enum SchedulerTypeTitle {
  Every = "every",
  AtLeast = "at least",
}

export enum SchedulerTypeKey {
  Every = 0,
  AtLeast = 1,
}

export interface SchedulerType {
  title: SchedulerTypeTitle;
  key: SchedulerTypeKey;
}

export type DayType = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export let SCHEDULER_TYPE: SchedulerType[] = [
  {
    title: SchedulerTypeTitle.Every,
    key: SchedulerTypeKey.Every,
  },
  {
    title: SchedulerTypeTitle.AtLeast,
    key: SchedulerTypeKey.AtLeast,
  },
];

export enum DAYS {
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
}

export interface HabitSchedulerStoreDefaultTypes {
  habitRepeatType: SchedulerTypeKey;
  habitRepeatPeriod: SchedulerPeriodKey;
  habitRepeatTimes: number;
  habitRepeatDays: Set<number>;
}

export interface HabitSchedulerStoreTypes
  extends HabitSchedulerStoreDefaultTypes {
  setHabitRepeatType: (value: SchedulerTypeKey) => void;
  setHabitRepeatPeriod: (value: SchedulerPeriodKey) => void;
  setHabitRepeatTimes: (value: number) => void;
  setHabitRepeatDays: (value: Set<number>) => void;
  resetScheduler: () => void;
}

export const HabitSchedulerStoreDefault: HabitSchedulerStoreDefaultTypes = {
  habitRepeatType: SchedulerTypeKey.Every,
  habitRepeatPeriod: SchedulerPeriodKey.Day,
  habitRepeatTimes: 1,
  habitRepeatDays: new Set([]),
};

export const useHabitSchedulerStore = create<HabitSchedulerStoreTypes>(
  (set) => ({
    habitRepeatType: HabitSchedulerStoreDefault.habitRepeatType,
    habitRepeatPeriod: HabitSchedulerStoreDefault.habitRepeatPeriod,
    habitRepeatTimes: HabitSchedulerStoreDefault.habitRepeatTimes,
    habitRepeatDays: HabitSchedulerStoreDefault.habitRepeatDays,

    setHabitRepeatType: async (value: SchedulerTypeKey) => {
      await set({ habitRepeatType: value });
    },
    setHabitRepeatPeriod: async (value: SchedulerPeriodKey) => {
      await set({ habitRepeatPeriod: value });
    },
    setHabitRepeatTimes: async (value: number) => {
      await set({ habitRepeatTimes: value });
    },
    setHabitRepeatDays: async (value: Set<number>) => {
      await set({ habitRepeatDays: value });
    },
    resetScheduler: async () => {
      await set({
        habitRepeatType: HabitSchedulerStoreDefault.habitRepeatType,
        habitRepeatPeriod: HabitSchedulerStoreDefault.habitRepeatPeriod,
        habitRepeatTimes: HabitSchedulerStoreDefault.habitRepeatTimes,
        habitRepeatDays: HabitSchedulerStoreDefault.habitRepeatDays,
      });
    },
  }),
);
