import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { useTasksStore } from "..";
import { TasksAPITypes } from "../api";
import { useWeekStore } from "../../Week";
import { sortByAssigned } from "../../../services/sorting";
import { SchedulerType, SchedulerPeriod } from "../../TaskScheduler";
import { StatusTypes, TasksTypes } from "../../../types/status";

dayjs.extend(isSameOrAfter);

const weekIsInArray = (weeks: string[], selectedWeek: string) =>
  weeks.some((date: string) => dayjs(date).isSame(dayjs(selectedWeek), "week"));

export const allRecurringTasksSelector = () => {
  const [tempTasks, setTempTasks] = useState<TasksAPITypes[]>([]);

  const selectedWeek = useWeekStore().selectedWeek;
  const tasks: TasksAPITypes[] = useTasksStore().tasks;

  useEffect(() => {
    const newTasks = tasks
      .filter((task: TasksAPITypes) => {
        let repeatTimes = task.repeatTimes;
        const removedForWeek = task?.removedForWeek || [];

        // Months
        if (task.repeatPeriod === SchedulerPeriod.month && task.repeatTimes) {
          repeatTimes = dayjs(task.assigned)
            .add(task.repeatTimes, "months")
            .diff(dayjs(task.assigned), "weeks");
        }

        // Years
        if (task.repeatPeriod === SchedulerPeriod.year && task.repeatTimes) {
          repeatTimes = dayjs(task.assigned)
            .add(task.repeatTimes, "years")
            .diff(dayjs(task.assigned), "weeks");
        }

        return (
          repeatTimes &&
          task.repeatType &&
          task.repeatType === SchedulerType.every &&
          !weekIsInArray(removedForWeek, selectedWeek) &&
          dayjs(selectedWeek).isSameOrAfter(dayjs(task.assigned), "week") &&
          dayjs(selectedWeek)
            .startOf("week")
            .diff(dayjs(task.assigned).startOf("week"), "weeks") %
            repeatTimes ===
            0
        );
      })
      .sort(sortByAssigned);

    setTempTasks(newTasks);
  }, [selectedWeek, tasks]);

  return tempTasks;
};

export const allActiveDefaultRecurringTasksSelector = () => {
  const allRecurringTasksSelectorAction = allRecurringTasksSelector();
  const [tempTasks, setTempTasks] = useState<TasksAPITypes[]>([]);

  const selectedWeek = useWeekStore().selectedWeek;

  useEffect(() => {
    const newTasks = [...allRecurringTasksSelectorAction]
      .filter(
        (task: TasksAPITypes) =>
          !weekIsInArray(task.repeatCompletedForWeeks, selectedWeek) &&
          task.status === StatusTypes.ACTIVE &&
          task.type === TasksTypes.RECURRING,
      )
      .sort(sortByAssigned);

    setTempTasks(newTasks);
  }, [selectedWeek, allRecurringTasksSelectorAction]);

  return tempTasks;
};

export const allActiveScheduledRecurringTasksSelector = () => {
  const allRecurringTasksSelectorAction = allRecurringTasksSelector();
  const [tempTasks, setTempTasks] = useState<TasksAPITypes[]>([]);

  const selectedWeek = useWeekStore().selectedWeek;

  useEffect(() => {
    const newTasks = [...allRecurringTasksSelectorAction]
      .filter(
        (task: TasksAPITypes) =>
          !weekIsInArray(task.repeatCompletedForWeeks, selectedWeek) &&
          task.status === StatusTypes.ACTIVE &&
          task.type === TasksTypes.SCHEDULED_RECURRING,
      )
      .sort(sortByAssigned);

    setTempTasks(newTasks);
  }, [selectedWeek, allRecurringTasksSelectorAction]);

  return tempTasks;
};

export const allCompletedRecurringTasksSelector = () => {
  const allRecurringTasksSelectorAction = allRecurringTasksSelector();
  const [tempTasks, setTempTasks] = useState<TasksAPITypes[]>([]);

  const selectedWeek = useWeekStore().selectedWeek;

  useEffect(() => {
    const newTasks = [...allRecurringTasksSelectorAction]
      .filter(
        (task: TasksAPITypes) =>
          weekIsInArray(task.repeatCompletedForWeeks, selectedWeek) ||
          task.status === StatusTypes.COMPLETED,
      )
      .map((item: TasksAPITypes) => ({
        ...item,
        completedForThisWeek: true,
      }))
      .sort(sortByAssigned);

    setTempTasks(newTasks);
  }, [selectedWeek, allRecurringTasksSelectorAction]);

  return tempTasks;
};
