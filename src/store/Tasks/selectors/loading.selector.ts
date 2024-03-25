import { useTasksStore } from "../../../store/Tasks";
import { DATA_FETCHING_STATUS } from "../../../types/status";

export const isLoadingSelector = () => {
  const loadingDefaultTasksStatus: DATA_FETCHING_STATUS =
    useTasksStore.getState().loadingDefaultTasksStatus;
  const loadingRecurringTasksStatus: DATA_FETCHING_STATUS =
    useTasksStore.getState().loadingRecurringTasksStatus;

  return (
    loadingDefaultTasksStatus !== DATA_FETCHING_STATUS.LOADED ||
    loadingRecurringTasksStatus !== DATA_FETCHING_STATUS.LOADED
  );
};
