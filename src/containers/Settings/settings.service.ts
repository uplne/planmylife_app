import axios, { AxiosError } from "axios";

import { SettingsAPITypes } from "../../store/Settings/api";

export const saveSettings = async ({ ...settings }: SettingsAPITypes) => {
  try {
    const response = await axios.post(`http://localhost:3001/api/v1/settings`, {
      weekly_email_reminder: settings.weekly_email_reminder,
      is_first_login: settings.is_first_login,
      tier: settings.tier,
      day_of_week: settings.day_of_week,
    });

    return response.status;
  } catch (e) {
    throw new Error(`Save settings: ${e}`);
  }
};

export const getSettings = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/settings`);

    if (response.data && response.data.length > 0) {
      return response.data[0] as SettingsAPITypes;
    }

    return null;
  } catch (e) {
    throw new Error(`Get settings: ${e}`);
  }
};

export const updateSettingsAPI = async ({ ...settings }: SettingsAPITypes) => {
  try {
    const response = await axios.put(`http://localhost:3001/api/v1/settings`, {
      weekly_email_reminder: settings.weekly_email_reminder,
      is_first_login: settings.is_first_login,
      tier: settings.tier,
      day_of_week: settings.day_of_week,
    });

    return response.status;
  } catch (error: any | AxiosError) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `Failed to update settings - response: ${error.response.status} ${error.response.data}`,
        );
      } else if (error.request) {
        throw new Error(
          `Failed to update settings - request: ${error.request}`,
        );
      }
    } else {
      throw new Error(`Failed to update settings: ${error.message}`);
    }
  }
};
