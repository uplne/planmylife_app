import { useEffect, useState } from "react";

import { allRecurringTasksSelector } from "./recurring.selector";
import { TasksAPITypes } from "../api";
import { useWeekStore } from "../../Week";
import { sortByAssigned } from "../../../services/sorting";
import { StatusTypes } from "../../../types/status";

/*
  Filter out recurring tasks that are in the ACTIVE state
*/
export const allActiveRecurringTasksSelector = (): TasksAPITypes[] => {
  const [tempTasks, setTempTasks] = useState<TasksAPITypes[]>([]);
  const selectedWeek = useWeekStore().selectedWeek;
  const tasks: TasksAPITypes[] = allRecurringTasksSelector();

  useEffect(() => {
    const newTasks = tasks
      .reduce((result: TasksAPITypes[], task: TasksAPITypes) => {
        if (task.status === StatusTypes.ACTIVE) {
          // Task is active and has nothing completed yet
          if (!("repeatCompletedForWeeks" in task)) {
            result.push(task);
            return result;
          }

          // Task is active and has some completed weeks but selected week hasn't been completed
          if (
            "repeatCompletedForWeeks" in task &&
            !task.repeatCompletedForWeeks.includes(selectedWeek)
          ) {
            result.push(task);
            return result;
          }

          return result;
        }

        return result;
      }, [])
      .sort(sortByAssigned);

    setTempTasks(newTasks);
  }, [selectedWeek, tasks]);

  return tempTasks;
};
