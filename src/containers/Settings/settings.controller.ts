import { useSettingsStateStore, LOADING } from "../../store/Settings";
import { saveSettings, getSettings } from "./api";
import { updateSettingsAPI } from "./settings.service";

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

export const fetchSettings = async (): Promise<boolean> => {
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
      await updateLocale(result.day_of_week);

      await updateIsLoading(LOADING.LOADED);

      return result.is_first_login;
    }

    return false;
  } catch (e) {
    await updateIsLoading(LOADING.ERROR);
    throw new Error(`Fetching settings failed: ${e}`);
  }
};

export const updateFirstLogin = async () => {
  const updateIsFirstLogin =
    await useSettingsStateStore.getState().updateIsFirstLogin;
  const { weekly_email_reminder, tier, day_of_week } =
    await useSettingsStateStore.getState();

  await updateIsFirstLogin(false);
  await updateSettingsAPI({
    weekly_email_reminder,
    is_first_login: false,
    tier,
    day_of_week,
  });
};
