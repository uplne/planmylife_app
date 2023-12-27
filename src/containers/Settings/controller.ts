import { doc, setDoc, getDoc } from "firebase/firestore";

import { useSettingsStateStore, LOADING } from '../../store/Settings';
import { useAuthStore } from '../../store/Auth';
import { db } from '../../services/firebase';

export const createSettings = async () => {
  const settings = await useSettingsStateStore.getState();
  const userId = await useAuthStore.getState().currentUser.id;

  try {
    const docRef = doc(db, 'settings', userId);
    await setDoc(docRef, { ...settings }, { merge: true });
  } catch(e) {
    console.log('Failed fetching settings: ', e);
  }
};

export const fetchSettings = async () => {
  const userId = await useAuthStore.getState().currentUser.id;
  const {
    updateIsLoading,
    updateWeeklyEmailReminder,
  } = await useSettingsStateStore.getState();

  await updateIsLoading(LOADING.FETCHING);

  // Load settings for the user from DB
  try {
    const docRef = doc(db, 'settings', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const settingsData = docSnap.data();

      if (settingsData) {
        if ('emailWeeklyReminderOptOut' in settingsData) {
          await updateWeeklyEmailReminder(settingsData.WeeklyEmailReminder);
        }

        // moment.updateLocale('en', {
        //   week: { dow: 0 },
        // });

        await updateIsLoading(LOADING.LOADED);
      }
    }
  } catch(e) {
    console.log('Fetching settings failed: ', e);
    await updateIsLoading(LOADING.ERROR);
  }
};