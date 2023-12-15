import { create } from 'zustand';

import { idType } from '../../types/idtype';
import { settings } from './api';

type SettingsTypes = {
  WeeklyEmailReminder: settings['schemas']['WeeklyEmailReminder'],
  updateWeeklyEmailReminder: (value: boolean) => void,
  isFirstLogin: settings['schemas']['isFirstLogin'],
  updateIsFirstLogin: (value: boolean) => void,
};

const SettingsDefault = {
  WeeklyEmailReminder: true,
  isFirstLogin: false,
};

export const getAppData = async () => {
  try {
    // load settings from firebase
  } catch(e) {
    console.log('Reading error: ', e);
  }
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
}));