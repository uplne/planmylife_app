import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { GoalTasksTypes } from "../api";
import { useWeekStore } from "../../Week";
import { sortByAssigned } from "../../../services/sorting";
import { StatusTypes } from "../../../types/status";
import { useGoalsStore } from "../index";

/*
  All tasks that don't have any schedule.
*/
export const allDefaultTasksSelector = () => {
  const [tempTasks, setTempTasks] = useState<GoalTasksTypes[]>([]);

  const selectedWeek = useWeekStore().selectedWeek;
  const tasks: GoalTasksTypes[] = useGoalsStore().tasks;

  useEffect(() => {
    const newTasks = tasks
      .filter(
        (task: GoalTasksTypes) =>
          task.status === StatusTypes.ACTIVE &&
          dayjs(task.assigned).isSame(dayjs(selectedWeek), "week"),
      )
      .sort(sortByAssigned);

    setTempTasks(newTasks);
  }, [selectedWeek, tasks]);

  return tempTasks;
};
