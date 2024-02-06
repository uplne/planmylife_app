import { create } from "zustand";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

import { useWeekStore } from "../Week";
import { useAuthStore } from "../Auth";
import { settings, TIER, DOW } from "./api";

export enum LOADING {
  "NODATA" = "NODATA",
  "FETCHING" = "FETCHING",
  "ERROR" = "ERROR",
  "LOADED" = "LOADED",
}

type SettingsTypes = {
  WeeklyEmailReminder: settings["schemas"]["WeeklyEmailReminder"];
  updateWeeklyEmailReminder: (value: boolean) => void;
  isFirstLogin: settings["schemas"]["isFirstLogin"];
  updateIsFirstLogin: (value: boolean) => void;
  tier: settings["schemas"]["tier"];
  dow: settings["schemas"]["dayOfWeek"];
  isLoading: LOADING;
  updateIsLoading: (value: LOADING) => void;
  updateLocale: (value: DOW) => void;
};

const SettingsDefault = {
  WeeklyEmailReminder: true,
  isFirstLogin: true,
  tier: TIER.FREE,
  dow: DOW.MONDAY,
  isLoading: LOADING.NODATA,
};

const saveAppState = async (values: Partial<SettingsTypes>, userId: string) => {
  try {
    const docRef = doc(db, "settings", userId);
    await updateDoc(docRef, { ...values });
  } catch (e) {
    console.log("Saving settings error: ", e);
  }
};

export const useSettingsStateStore = create<SettingsTypes>((set, get) => ({
  WeeklyEmailReminder: SettingsDefault.WeeklyEmailReminder,
  updateWeeklyEmailReminder: async (value) => {
    const userId = useAuthStore.getState().currentUser?.id;

    if (userId) {
      await saveAppState({ WeeklyEmailReminder: value }, userId);
      set({ WeeklyEmailReminder: value });
    }
  },
  isFirstLogin: SettingsDefault.isFirstLogin,
  updateIsFirstLogin: async (value) => {
    const userId = useAuthStore.getState().currentUser?.id;

    if (userId) {
      await saveAppState({ isFirstLogin: value }, userId);
      set({ isFirstLogin: value });
    }
  },
  tier: SettingsDefault.tier,
  dow: SettingsDefault.dow,
  isLoading: SettingsDefault.isLoading,
  updateIsLoading: async (value) => {
    set({ isLoading: value });
  },
  updateLocale: async (value: DOW) => {
    await set({ dow: value });
    dayjs.extend(updateLocale);
    dayjs.updateLocale("en", {
      weekStart: value,
    });
    await useWeekStore.getState().reset();
  },
}));
