import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";

import { useWeekStore } from "../Week";
import { useAuthStore } from "../Auth";
import { SettingsAPITypes, TIER, DOW } from "./api";
import { createClearable } from "../../services/createClearable";

export enum LOADING {
  "NODATA" = "NODATA",
  "FETCHING" = "FETCHING",
  "ERROR" = "ERROR",
  "LOADED" = "LOADED",
}

type SettingsTypes = {
  weekly_email_reminder: SettingsAPITypes["weekly_email_reminder"];
  updateWeeklyEmailReminder: (value: boolean) => void;
  is_first_login: SettingsAPITypes["is_first_login"];
  updateIsFirstLogin: (value: boolean) => void;
  tier: SettingsAPITypes["tier"];
  day_of_week: SettingsAPITypes["day_of_week"];
  isLoading: LOADING;
  updateIsLoading: (value: LOADING) => void;
  updateLocale: (value: DOW) => void;
};

export const SettingsDefault = {
  weekly_email_reminder: true,
  is_first_login: true,
  tier: TIER.FREE,
  day_of_week: DOW.MONDAY,
  isLoading: LOADING.NODATA,
};

export const useSettingsStateStore = createClearable<SettingsTypes>((set) => ({
  weekly_email_reminder: SettingsDefault.weekly_email_reminder,
  updateWeeklyEmailReminder: async (value) => {
    const userId = useAuthStore.getState().currentUser?.id;

    if (userId) {
      // await saveAppState({ WeeklyEmailReminder: value }, userId);
      set({ weekly_email_reminder: value });
    }
  },
  is_first_login: SettingsDefault.is_first_login,
  updateIsFirstLogin: async (value) => {
    const userId = useAuthStore.getState().currentUser?.id;

    if (userId) {
      set({ is_first_login: value });
    }
  },
  tier: SettingsDefault.tier,
  day_of_week: SettingsDefault.day_of_week,
  isLoading: SettingsDefault.isLoading,
  updateIsLoading: async (value) => {
    set({ isLoading: value });
  },
  updateLocale: async (value: DOW) => {
    await set({ day_of_week: value });
    dayjs.extend(updateLocale);
    dayjs.updateLocale("en", {
      weekStart: value,
    });
    await useWeekStore.getState().reset();
  },
}));
