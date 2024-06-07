import dayjs from "dayjs";

import { TagMoved } from "../../TaskIndicator/TagMoved";
import { TagRecurring } from "../../TaskIndicator/TagRecurring";
import { TaskType } from "../../../store/Tasks";
import type { GoalTasksTypes, GoalsAPITypes } from "../../../store/Goals/api";
import { useWeekStore } from "../../../store/Week";
import { isRecurringTask, getRecurring } from "../../../services/recurring";

type ComponentProps = {
  task: TaskType | GoalTasksTypes | GoalsAPITypes;
};

const weekIsInArray = (movedWeeks: string[], selectedWeek: string) =>
  movedWeeks.some(
    (date: string) =>
      dayjs(date).isSame(dayjs(selectedWeek), "week") ||
      dayjs(date).add(1, "week").isSame(dayjs(selectedWeek), "week"),
  );

export const TaskStatus = ({ task }: ComponentProps) => {
  const { selectedWeek } = useWeekStore();

  const showMoved = () =>
    task?.moved &&
    task.moved.length > 0 &&
    weekIsInArray(task.moved, selectedWeek);

  return (
    <div className="absolute top-[-9px] right-[10px] flex flex-row">
      {showMoved() && <TagMoved />}
      {"type" in task && isRecurringTask(task.type) && (
        <TagRecurring recurring={getRecurring(task)} />
      )}
    </div>
  );
};
