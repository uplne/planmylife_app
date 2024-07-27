import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";

import { useGoalsStore } from "../../store/Goals";
import { useWeekStore } from "../../store/Week";
import { idType } from "../../types/idtype";
import { GoalsAPITypes } from "../../store/Goals/api";
import { updateGoalAPI } from "./goals.service";
import { findGoalById } from "./goals.controller";
import { showSuccessNotification } from "../../components/Notification/controller";
import { NOTIFICATION_TYPE } from "../../store/Notification";

dayjs.extend(weekday);
dayjs.extend(utc);

// export const updateGoal = async (goalId: idType) => {
//   const updateGoalStore = await useGoalsStore.getState().updateGoal;
//   const tempGoal = await useGoalsStore.getState().tempGoal;
//   const resetTempGoal = await useGoalsStore.getState().resetTempGoal;
//   const { resetModal } = useModalStore.getState();

//   const goal: GoalsAPITypes = await findGoalById(goalId);

//   const updateGoal = {
//     ...goal,
//     ...tempGoal,
//     updated: dayjs().format(),
//   };

//   await updateGoalStore(updateGoal);
//   await updateGoalAPI(updateGoal);
//   await showSuccessNotification({
//     message: "Goal updated",
//     type: NOTIFICATION_TYPE.SUCCESS,
//   });
//   await resetTempGoal();
//   await resetModal();

//   return goal;
// };

export const toggleHabitFromGoal = async (goalId: idType, dayIndex: number) => {
  const updateGoalStore = await useGoalsStore.getState().updateGoal;
  const selectedWeek = await useWeekStore.getState().selectedWeek;
  const goal: GoalsAPITypes = await findGoalById(goalId);
  const completedDatesSet: Set<string> = new Set(
    goal.habitCompletedDays?.map((item) => dayjs(item).format()) ?? [],
  );
  const selectedDate = dayjs(selectedWeek)
    .weekday(dayIndex)
    .startOf("day")
    .format();

  if (completedDatesSet.has(selectedDate)) {
    completedDatesSet.delete(selectedDate);
  } else {
    completedDatesSet.add(selectedDate);
  }

  const updateGoal = {
    ...goal,
    habitCompletedDays: [...completedDatesSet],
    updated: dayjs().format(),
  };

  await updateGoalStore(updateGoal);
  await updateGoalAPI(updateGoal);
  await showSuccessNotification({
    message: "Goal updated",
    type: NOTIFICATION_TYPE.SUCCESS,
  });
};
