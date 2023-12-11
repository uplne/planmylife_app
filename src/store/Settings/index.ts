import { create } from 'zustand';

import { idType } from '../../types/idtype';
import { settings } from './api';

type SettingsType = {
  WeeklyEmailReminder: settings['schemas']['WeeklyEmailReminder'],
  updateWeeklyEmailReminder: (value: boolean) => void,
  isFirstLogin: settings['schemas']['isFirstLogin'],
  updateIsFirstLogin: (value: boolean) => void,
};

const SettingsDefault = {
  WeeklyEmailReminder: true,
  isFirstLogin: true,
};

export const getAppData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@gratitude_journal_appstate');
    const parsedJSONValue  = jsonValue != null ? JSON.parse(jsonValue) : {};

    return {
      ...appStateDefaultValues,
      ...parsedJSONValue,
    };
  } catch(e) {
    console.log('Reading error: ', e);
  }
};

const saveAppState = async (values: Partial<AppStateTypes>) => {
  try {
    const jsonValue = JSON.stringify(values);

    await AsyncStorage.setItem('@gratitude_journal_appstate', jsonValue);
  } catch (e) {
    console.log('Saving error: ', e);
  }
};

const updateAppState = async (values:Partial<AppStateTypes>, state: AppStateTypes) => {
  await saveAppState({
    ...state,
    ...values,
  });
};

export const useAppStateStore = create<AppStateType>((set, get) => ({
  appState: appStateDefaultValues,
  shouldLock: true,
  updateShouldLock: async (value: boolean) => {
    set({ shouldLock: value });
    // setTimeout(() => {
    //   const currentShouldLock = get().shouldLock;

    //   if (currentShouldLock) {
    //     set({ shouldLock: true });
    //   }
    // }, 5000);
  },
  updateAppState: async (values:Partial<AppStateTypes>) => {
    const appStateValues: AppStateTypes = get().appState;
    await updateAppState(values, appStateValues);
    set({ appState: {
      ...appStateValues,
      ...values,
    }});
  }
}));