import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { GoalTasksTypes, GoalsAPITypes } from "../api";
import { useWeekStore } from "../../Week";
import { sortByAssigned } from "../../../services/sorting";
import { GoalAssignmentTypes, StatusTypes } from "../../../types/status";
import { useGoalsStore } from "../index";

/*
  All tasks that don't have any schedule.
*/
export const allDefaultTasksSelector = () => {
  const [tempTasks, setTempTasks] = useState<
    GoalTasksTypes[] | GoalsAPITypes[]
  >([]);

  const selectedWeek = useWeekStore().selectedWeek;
  const tasks: GoalTasksTypes[] = useGoalsStore().tasks;
  const goals: GoalsAPITypes[] = useGoalsStore().goals;

  useEffect(() => {
    const newTasks = tasks
      .filter(
        (task: GoalTasksTypes) =>
          task.status === StatusTypes.ACTIVE &&
          dayjs(task.assigned).isSame(dayjs(selectedWeek), "week"),
      )
      .sort(sortByAssigned);

    const newGoals = goals
      .filter(
        (goal: GoalsAPITypes) =>
          goal.status === StatusTypes.ACTIVE &&
          goal.assignment === GoalAssignmentTypes.DEFAULT &&
          dayjs(goal.assigned).isSame(dayjs(selectedWeek), "week"),
      )
      .sort(sortByAssigned);

    setTempTasks([...newTasks, ...newGoals]);
  }, [selectedWeek, tasks, goals]);

  return tempTasks;
};
