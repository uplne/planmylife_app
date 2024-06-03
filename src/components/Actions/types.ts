export type goalTaskActionTypes =
  | "complete"
  | "unComplete"
  | "remove"
  | "move"
  | "edit"
  | "addSubtasks"
  | "addToWeek"
  | "removeFromWeek"
  | "schedule";

export type copyTypes = {
  remove?: string;
};
