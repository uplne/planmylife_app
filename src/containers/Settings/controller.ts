import { useSettingsStateStore, LOADING } from "../../store/Settings";
import { saveSettings, getSettings } from "./api";

export const createSettings = async () => {
  const weekly_email_reminder =
    await useSettingsStateStore.getState().weekly_email_reminder;
  const is_first_login = await useSettingsStateStore.getState().is_first_login;
  const tier = await useSettingsStateStore.getState().tier;
  const day_of_week = await useSettingsStateStore.getState().day_of_week;

  try {
    await saveSettings({
      weekly_email_reminder,
      is_first_login,
      tier,
      day_of_week,
    });
  } catch (e) {
    throw new Error("Error creating settings");
  }
};

export const fetchSettings = async () => {
  const updateIsLoading =
    await useSettingsStateStore.getState().updateIsLoading;
  const updateWeeklyEmailReminder =
    await useSettingsStateStore.getState().updateWeeklyEmailReminder;
  const updateLocale = await useSettingsStateStore.getState().updateLocale;
  const updateIsFirstLogin =
    await useSettingsStateStore.getState().updateIsFirstLogin;

  await updateIsLoading(LOADING.FETCHING);

  // Load settings for the user from DB
  try {
    console.log("get settings");
    const result = await getSettings();

    if (result) {
      if ("weekly_email_reminder" in result) {
        updateWeeklyEmailReminder(result.weekly_email_reminder);
      }

      await updateIsFirstLogin(result.is_first_login);
      console.log("update locale");
      await updateLocale(result.day_of_week);

      await updateIsLoading(LOADING.LOADED);
    }
  } catch (e) {
    await updateIsLoading(LOADING.ERROR);
    throw new Error(`Fetching settings failed: ${e}`);
  }
};
