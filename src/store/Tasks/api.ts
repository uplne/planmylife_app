import { idType } from "../../types/idtype";
import { StatusTypes, TasksTypes } from '../../types/status';

export interface TasksAPITypes {
  schemas: {
    [TasksTypes.DEFAULT]: {
      id: idType,
      status: StatusTypes,
      title: string,
      created: string,
      createdTimestamp: string,
      updated: string,
      assigned: string,
      assignedTimestamp: string,
      completed: string,
      moved: string[],
    },
  },
};