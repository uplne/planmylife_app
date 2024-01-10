import { Timestamp } from '../../services/firebase';

import { idType } from "../../types/idtype";
import { StatusTypes, TasksTypes } from '../../types/status';

export interface TasksAPITypes {
  schemas: {
    [TasksTypes.DEFAULT]: {
      id: idType,
      type: TasksTypes,
      status: StatusTypes,
      title: string,
      created: string | null,
      createdTimestamp: Timestamp | null,
      updated: string | null,
      assigned: string | null,
      assignedTimestamp: Timestamp | null,
      completed: string | null,
      moved: string[],
      date: string,
    },
  },
};