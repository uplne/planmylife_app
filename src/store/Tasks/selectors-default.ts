import { createSelector } from 'reselect';
import flow from 'lodash/fp/flow';
import filter from 'lodash/fp/filter';
import sortBy from 'lodash/fp/sortBy';
import dayjs from 'dayjs';

import { TasksStoreTypes, TaskType } from './index';
import { useWeekStore } from '../Week';
import { TasksTypes, StatusTypes } from '../../types/status';

export const defaultTasksSelector = createSelector(
  (state:TasksStoreTypes) => state.tasks,
  () => useWeekStore.getState().selectedWeekId,
  (tasks, selectedWeekId) => flow(
    filter((task:TaskType) =>
      task.type === TasksTypes.DEFAULT &&
      task.status === StatusTypes.ACTIVE &&
      dayjs(task.assigned).isSame(dayjs(selectedWeekId), 'week')
    ),
    sortBy('assigned'),
    )(tasks)
);