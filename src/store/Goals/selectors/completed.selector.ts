import { useEffect, useState } from "react";

import { GoalTasksTypes } from "../api";
import { sortByAssigned } from "../../../services/sorting";
import { useWeekStore } from "../../Week";
import { defaultCompletedTasksSelector } from "./default.completed.selector";

export const allCompletedTasksSelector = () => {
  const selectedWeek = useWeekStore().selectedWeek;
  const [tempTasks, setTempTasks] = useState<GoalTasksTypes[]>([]);

  const defaultCompletedTasks = defaultCompletedTasksSelector();

  useEffect(() => {
    const newTasks = [...defaultCompletedTasks].sort(sortByAssigned);

    setTempTasks(newTasks);
  }, [defaultCompletedTasks, selectedWeek]);

  return tempTasks;
};
