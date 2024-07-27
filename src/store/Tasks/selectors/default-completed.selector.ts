import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { TasksAPITypes } from "../api";
import { useWeekStore } from "../../Week";
import { sortByAssigned } from "../../../services/sorting";
import { StatusTypes, TasksTypes } from "../../../types/status";
import { useTasksStore } from "../index";

export const defaultCompletedTasksSelector = () => {
  const [tempTasks, setTempTasks] = useState<TasksAPITypes[]>([]);
  const selectedWeek = useWeekStore().selectedWeek;
  const tasks: TasksAPITypes[] = useTasksStore().tasks;

  useEffect(() => {
    const newTasks = tasks
      .filter(
        (task: TasksAPITypes) =>
          (task.type === TasksTypes.DEFAULT ||
            task.type === TasksTypes.SCHEDULED) &&
          task.status === StatusTypes.COMPLETED &&
          dayjs(task.assigned).isSame(dayjs(selectedWeek), "week"),
      )
      .sort(sortByAssigned);

    setTempTasks(newTasks);
  }, [selectedWeek, tasks]);

  return tempTasks;
};
