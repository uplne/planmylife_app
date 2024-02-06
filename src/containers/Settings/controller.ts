import { doc, setDoc, getDoc } from "firebase/firestore";

import { useSettingsStateStore, LOADING } from "../../store/Settings";
import { useAuthStore } from "../../store/Auth";
import { db } from "../../services/firebase";

export const createSettings = async () => {
  const settings = await useSettingsStateStore.getState();
  const userId = await useAuthStore.getState().currentUser?.id;

  if (userId) {
    try {
      const docRef = doc(db, "settings", userId);
      await setDoc(
        docRef,
        {
          WeeklyEmailReminder: settings.WeeklyEmailReminder,
          isFirstLogin: settings.isFirstLogin,
          tier: settings.tier,
          dow: settings.dow,
        },
        { merge: true },
      );
    } catch (e) {
      console.log("Failed fetching settings: ", e);
    }
  }
};

export const fetchSettings = async () => {
  const userId = await useAuthStore.getState().currentUser?.id;

  if (userId) {
    const {
      updateIsLoading,
      updateWeeklyEmailReminder,
      updateLocale,
      updateIsFirstLogin,
    } = await useSettingsStateStore.getState();

    await updateIsLoading(LOADING.FETCHING);

    // Load settings for the user from DB
    try {
      const docRef = doc(db, "settings", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const settingsData = docSnap.data();

        console.log("settingsData: ", settingsData);

        if (settingsData) {
          if ("emailWeeklyReminderOptOut" in settingsData) {
            await updateWeeklyEmailReminder(settingsData.WeeklyEmailReminder);
          }

          await updateIsFirstLogin(settingsData.isFirstLogin);
          await updateLocale(settingsData.dow);

          await updateIsLoading(LOADING.LOADED);
        }
      }
    } catch (e) {
      console.log("Fetching settings failed: ", e);
      await updateIsLoading(LOADING.ERROR);
    }
  }
};
