import { TasksTypes } from "../types/status";
import { SchedulerType, SCHEDULER_PERIOD_LABEL } from "../store/TaskScheduler";
import { TaskType } from "../store/Tasks";

export const isRecurringTask = (type: TasksTypes) =>
  type === TasksTypes.RECURRING || type === TasksTypes.SCHEDULED_RECURRING;

export const getRecurring = (task: TaskType) => {
  if (
    task &&
    typeof task.repeatTimes === "number" &&
    typeof task.repeatPeriod === "number" &&
    typeof task.repeatType === "number"
  ) {
    const period =
      task.repeatTimes > 1
        ? SCHEDULER_PERIOD_LABEL[task.repeatPeriod].labelPlural
        : SCHEDULER_PERIOD_LABEL[task.repeatPeriod].label;

    if (task.isInactive) {
      return `${SchedulerType[task.repeatType]} ${task.repeatTimes} ${period} - completed`;
    } else {
      return `${SchedulerType[task.repeatType]} ${task.repeatTimes} ${period}`;
    }
  }
};
