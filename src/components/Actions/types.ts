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

export enum goalActionTypes {
  COMPLETE = "complete",
  UNCOMPLETE = "unComplete",
  REMOVE = "remove",
  MOVE = "move",
  EDIT = "edit",
  ADDSUBTASKS = "addSubtasks",
  ADDTOWEEK = "addToWeek",
  REMOVEFROMWEEK = "removeFromWeek",
  SCHEDULE = "schedule",
}

export type copyTypes = {
  remove?: string;
};
