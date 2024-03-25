import { useEffect, useState } from "react";

import { TasksAPITypes } from "../api";
import { sortByAssigned } from "../../../services/sorting";
import { useWeekStore } from "../../Week";
import { defaultCompletedTasksSelector } from "./default-completed.selector";
import { allCompletedRecurringTasksSelector } from "./recurring.selector";

export const allCompletedTasksSelector = () => {
  const selectedWeek = useWeekStore().selectedWeek;
  const [tempTasks, setTempTasks] = useState<TasksAPITypes[]>([]);

  const defaultCompletedTasks = defaultCompletedTasksSelector();
  const allCompletedRecurringTasks = allCompletedRecurringTasksSelector();

  useEffect(() => {
    const newTasks = [
      ...defaultCompletedTasks,
      ...allCompletedRecurringTasks,
    ].sort(sortByAssigned);

    setTempTasks(newTasks);
  }, [defaultCompletedTasks, allCompletedRecurringTasks, selectedWeek]);

  return tempTasks;
};
