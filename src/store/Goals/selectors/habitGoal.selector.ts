import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { GoalsAPITypes } from "../api";
import { sortByAssigned } from "../../../services/sorting";
import { useGoalsStore } from "../index";
import { useWeekStore } from "../../Week";
import { GoalAssignmentTypes, StatusTypes } from "../../../types/status";

dayjs.extend(isSameOrAfter);

export const habitGoalSelector = () => {
  const [tempGoals, setTempGoals] = useState<GoalsAPITypes[]>([]);
  const goals: GoalsAPITypes[] = useGoalsStore().goals;
  const selectedWeek = useWeekStore().selectedWeek;

  useEffect(() => {
    const newTasks = [...goals]
      .filter(
        (goal) =>
          goal.assignment === GoalAssignmentTypes.HABIT &&
          goal.status !== StatusTypes.COMPLETED &&
          dayjs(selectedWeek).isSameOrAfter(dayjs(goal.assigned), "week"),
      )
      .sort(sortByAssigned);

    setTempGoals(newTasks);
  }, [goals, selectedWeek]);

  return tempGoals;
};
