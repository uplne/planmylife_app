export const enum TIER {
  "FREE" = "FREE",
  "SUBSCRIPTION" = "SUBSCRIPTION",
}

export const enum DOW {
  "MONDAY" = 1,
  "SUNDAY" = 0,
}
export interface settings {
  schemas: {
    WeeklyEmailReminder: boolean;
    GoalNotifications: {
      EndOfYear: boolean;
      HalfYear: boolean;
      quarter: boolean;
    };
    isFirstLogin: boolean;
    tier: TIER;
    dayOfWeek: number;
  };
}
