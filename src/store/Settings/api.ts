export const enum TIER {
  "FREE" = "FREE",
  "SUBSCRIPTION" = "SUBSCRIPTION",
}

export const enum DOW {
  "MONDAY" = 1,
  "SUNDAY" = 0,
}
export type SettingsAPITypes = {
  weekly_email_reminder: boolean;
  is_first_login: boolean;
  tier: TIER;
  day_of_week: number;
};
