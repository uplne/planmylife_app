import { useEffect, useState } from "react";

import { TasksAPITypes } from "../api";
import { sortByAssigned } from "../../../services/sorting";
import { defaultCompletedTasksSelector } from "./default-completed.selector";
import { allCompletedRecurringTasksSelector } from "./recurring.selector";

export const allCompletedTasksSelector = () => {
  const [tempTasks, setTempTasks] = useState<TasksAPITypes[]>([]);

  const defaultCompletedTasks = defaultCompletedTasksSelector();
  const allCompletedRecurringTasks = allCompletedRecurringTasksSelector();

  useEffect(() => {
    const newTasks = [
      ...defaultCompletedTasks,
      ...allCompletedRecurringTasks,
    ].sort(sortByAssigned);

    setTempTasks(newTasks);
  }, [defaultCompletedTasks]);

  return tempTasks;
};
