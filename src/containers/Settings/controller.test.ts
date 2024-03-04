import * as API from "./api";
import { SettingsAPITypes, TIER } from "../../store/Settings/api";
import { createSettings, fetchSettings } from "./controller";
import { useSettingsStateStore, LOADING } from "../../store/Settings";

const MOCK_SETTINGS: SettingsAPITypes = {
  weekly_email_reminder: true,
  is_first_login: true,
  tier: TIER.FREE,
  day_of_week: 1,
};

describe("SETTINGS - CONTROLLER", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("createSettings", async () => {
    const spySaveSettings = jest
      .spyOn(API, "saveSettings")
      .mockResolvedValueOnce(Promise.resolve(1));
    await createSettings();

    expect(spySaveSettings).toHaveBeenCalledWith(MOCK_SETTINGS);
  });

  test("createSettings - error", async () => {
    jest.spyOn(API, "saveSettings").mockRejectedValueOnce("Error");

    await expect(createSettings()).rejects.toThrow("Error creating settings");
  });

  test("fetchSettings", async () => {
    jest.spyOn(API, "getSettings").mockResolvedValueOnce({
      ...MOCK_SETTINGS,
      is_first_login: false,
    });
    jest.spyOn(useSettingsStateStore.getState(), "updateIsLoading");
    jest.spyOn(useSettingsStateStore.getState(), "updateWeeklyEmailReminder");
    jest.spyOn(useSettingsStateStore.getState(), "updateIsFirstLogin");
    jest.spyOn(useSettingsStateStore.getState(), "updateLocale");

    await fetchSettings();

    expect(
      useSettingsStateStore.getState().updateIsLoading,
    ).toHaveBeenCalledWith(LOADING.FETCHING);
    expect(
      useSettingsStateStore.getState().updateWeeklyEmailReminder,
    ).toHaveBeenCalledWith(true);
    expect(
      useSettingsStateStore.getState().updateIsFirstLogin,
    ).toHaveBeenCalledWith(false);
    expect(useSettingsStateStore.getState().updateLocale).toHaveBeenCalledWith(
      1,
    );
    expect(
      useSettingsStateStore.getState().updateIsLoading,
    ).toHaveBeenCalledWith(LOADING.LOADED);
  });

  test("fetchSettings - error", async () => {
    jest.spyOn(API, "getSettings").mockRejectedValueOnce("Error");
    jest.spyOn(useSettingsStateStore.getState(), "updateIsFirstLogin");

    await expect(fetchSettings()).rejects.toThrow(
      "Fetching settings failed: Error",
    );
    expect(
      useSettingsStateStore.getState().updateIsLoading,
    ).toHaveBeenCalledWith(LOADING.ERROR);
  });
});
