import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { TasksAPITypes } from "../api";
import { useWeekStore } from "../../Week";
import { useTasksStore } from "../index";
import { StatusTypes, TasksTypes } from "../../../types/status";
import { sortByAssigned } from "../../../services/sorting";
import { allActiveScheduledRecurringTasksSelector } from "./recurring.selector";

// ACTIVE TASKS
export const allDefaultScheduledTasksSelector = (): TasksAPITypes[] => {
  const selectedWeek = useWeekStore().selectedWeek;
  const tasks: TasksAPITypes[] = useTasksStore().tasks;
  const allActiveScheduledRecurringTasks =
    allActiveScheduledRecurringTasksSelector();
  const [tempTasks, setTempTasks] = useState<TasksAPITypes[]>([]);

  useEffect(() => {
    const newTasks = [...tasks]
      .filter(
        (task: TasksAPITypes) =>
          task.type === TasksTypes.SCHEDULE &&
          dayjs(task.assigned).isSame(dayjs(selectedWeek), "week") &&
          task.status === StatusTypes.ACTIVE,
      )
      .concat(allActiveScheduledRecurringTasks)
      .sort(sortByAssigned);

    setTempTasks(newTasks);
  }, [selectedWeek, tasks, allActiveScheduledRecurringTasks]);

  return tempTasks;
};

// SCHEDULED - TODAY
export const todayDefaultScheduledTasksSelector = (): TasksAPITypes[] => {
  const tasks: TasksAPITypes[] = allDefaultScheduledTasksSelector();
  const [tempTasks, setTempTasks] = useState<TasksAPITypes[]>([]);

  useEffect(() => {
    const newTasks = tasks
      .filter((task) => dayjs().isSame(dayjs(task.assigned), "day"))
      .sort(sortByAssigned);

    setTempTasks(newTasks);
  }, [tasks]);

  return tempTasks;
};

// SCHEDULED - TOMORROW
export const tomorrowDefaultScheduledTasksSelector = (): TasksAPITypes[] => {
  const tasks: TasksAPITypes[] = allDefaultScheduledTasksSelector();
  const [tempTasks, setTempTasks] = useState<TasksAPITypes[]>([]);

  useEffect(() => {
    const newTasks = tasks
      .filter((task) =>
        dayjs().clone().add(1, "day").isSame(dayjs(task.assigned), "day"),
      )
      .sort(sortByAssigned);

    setTempTasks(newTasks);
  }, [tasks]);

  return tempTasks;
};

// SCHEDULED - OTHER DAYS
export const otherDaysDefaultScheduledTasksSelector = (): TasksAPITypes[] => {
  const tasks: TasksAPITypes[] = allDefaultScheduledTasksSelector();
  const [tempTasks, setTempTasks] = useState<TasksAPITypes[]>([]);

  useEffect(() => {
    const newTasks = tasks
      .filter(
        (task) =>
          !dayjs().isSame(dayjs(task.assigned), "day") &&
          !dayjs().clone().add(1, "day").isSame(dayjs(task.assigned), "day"),
      )
      .sort(sortByAssigned);

    setTempTasks(newTasks);
  }, [tasks]);

  return tempTasks;
};
