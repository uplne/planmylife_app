import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { TasksAPITypes } from "../api";
import { useWeekStore } from "../../Week";
import { sortByAssigned } from "../../../services/sorting";
import { StatusTypes, TasksTypes } from "../../../types/status";
import { useTasksStore } from "../index";
import { allActiveDefaultRecurringTasksSelector } from "./recurring.selector";

/*
  All tasks that don't have any schedule. They can be DEFAULT tasks or RECURRING tasks
*/
export const allDefaultTasksSelector = () => {
  const [tempTasks, setTempTasks] = useState<TasksAPITypes[]>([]);
  const allActiveDefaultRecurringTasks =
    allActiveDefaultRecurringTasksSelector();

  const selectedWeek = useWeekStore().selectedWeek;
  const tasks: TasksAPITypes[] = useTasksStore().tasks;

  useEffect(() => {
    const newTasks = tasks
      .filter(
        (task: TasksAPITypes) =>
          task.type === TasksTypes.DEFAULT &&
          task.status === StatusTypes.ACTIVE &&
          dayjs(task.assigned).isSame(dayjs(selectedWeek), "week"),
      )
      .concat(allActiveDefaultRecurringTasks)
      .sort(sortByAssigned);

    setTempTasks(newTasks);
  }, [selectedWeek, tasks, allActiveDefaultRecurringTasks]);

  return tempTasks;
};
