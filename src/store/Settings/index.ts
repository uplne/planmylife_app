import { create } from 'zustand';

import { settings, TIER, DOW } from './api';

export enum LOADING {
  'NODATA' = 'NODATA',
  'FETCHING' = 'FETCHING',
  'ERROR' = 'ERROR',
  'LOADED' = 'LOADED',
};

type SettingsTypes = {
  WeeklyEmailReminder: settings['schemas']['WeeklyEmailReminder'],
  updateWeeklyEmailReminder: (value: boolean) => void,
  isFirstLogin: settings['schemas']['isFirstLogin'],
  updateIsFirstLogin: (value: boolean) => void,
  tier: settings['schemas']['tier'],
  dow: settings['schemas']['dayOfWeek'],
  isLoading: LOADING,
  updateIsLoading: (value: LOADING) => void,
};

const SettingsDefault = {
  WeeklyEmailReminder: true,
  isFirstLogin: false,
  tier: TIER.FREE,
  dow: DOW.MONDAY,
  isLoading: LOADING.NODATA,
};

const saveAppState = async (values: Partial<SettingsTypes>) => {
  try {
    // save settings to firebase
  } catch (e) {
    console.log('Saving error: ', e);
  }
};

const updateAppState = async (values:Partial<SettingsTypes>, state: SettingsTypes) => {
  await saveAppState({
    ...state,
    ...values,
  });
};

export const useSettingsStateStore = create<SettingsTypes>((set, get) => ({
  WeeklyEmailReminder: SettingsDefault.WeeklyEmailReminder,
  updateWeeklyEmailReminder: async (value) => {
    await saveAppState({ WeeklyEmailReminder: value });
    set({ WeeklyEmailReminder: value });
  },
  isFirstLogin: SettingsDefault.isFirstLogin,
  updateIsFirstLogin: async (value) => {
    await saveAppState({ isFirstLogin: value });
    set({ isFirstLogin: value });
  },
  tier: SettingsDefault.tier,
  dow: SettingsDefault.dow,
  isLoading: SettingsDefault.isLoading,
  updateIsLoading: async (value) => {
    set({ isLoading: value });
  },
}));