import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { GoalTasksTypes } from "../api";
import { useGoalsStore } from "../index";
import { StatusTypes } from "../../../types/status";

/*
  All tasks for the goalId
*/
export const goalTasksSelector = (goalId: GoalTasksTypes["goalId"]) => {
  const [tempTasks, setTempTasks] = useState<GoalTasksTypes[]>([]);

  const tasks: GoalTasksTypes[] = useGoalsStore().tasks;

  useEffect(() => {
    const newTasks = tasks
      .filter((task: GoalTasksTypes) => task.goalId === goalId)
      .sort((a, b) => dayjs(a.created).valueOf() - dayjs(b.created).valueOf())
      .sort((a, b) => {
        if (
          a.status === StatusTypes.COMPLETED &&
          b.status !== StatusTypes.COMPLETED
        ) {
          return 1;
        } else if (
          a.status !== StatusTypes.COMPLETED &&
          b.status === StatusTypes.COMPLETED
        ) {
          return -1;
        } else {
          return 0;
        }
      });

    setTempTasks(newTasks);
  }, [tasks]);

  return tempTasks;
};
