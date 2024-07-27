import { useState, useEffect } from "react";
import { useGoalsStore } from "../../store/Goals";
import { DATA_FETCHING_STATUS } from "../../types/status";

export const useIsLoading = () => {
  const [loading, setLoading] = useState(true);
  const loadingDefaultTasksStatus: DATA_FETCHING_STATUS =
    useGoalsStore().loadingTasks;

  useEffect(() => {
    setLoading(loadingDefaultTasksStatus !== DATA_FETCHING_STATUS.LOADED);
  }, [loadingDefaultTasksStatus]);

  return loading;
};
