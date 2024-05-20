import dayjs from "dayjs";

import { TaskIndicator } from "../../TaskIndicator";
import { TaskType } from "../../../store/Tasks";
import { useWeekStore } from "../../../store/Week";
import { isRecurringTask, getRecurring } from "../../../services/recurring";

type ComponentProps = {
  task: TaskType;
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
    task.moved.length > 0 && weekIsInArray(task.moved, selectedWeek);

  return (
    <div className="absolute top-[-9px] right-[10px] flex flex-row">
      {showMoved() && <TaskIndicator moved />}
      {isRecurringTask(task.type) && (
        <TaskIndicator recurring={getRecurring(task)} />
      )}
    </div>
  );
};
