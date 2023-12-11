export interface settings {
  schemas: {
    WeeklyEmailReminder: boolean,
    GoalNotifications: {
      EndOfYear: boolean,
      HalfYear: boolean,
      quarter: boolean,
    },
    HelpNotifications: {
      Goals: boolean,
      Overview: {
        Diary: boolean,
        Goals: boolean,
        Tasks: boolean,
      },
    },
    isFirstLogin: boolean,
  },
};