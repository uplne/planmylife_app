import { useMemo } from "react";
import { useGoalsStore } from "../../../store/Goals";
import { StatusTypes } from "../../../types/status";

export const useGetActiveGoals = () => {
  const goals = useGoalsStore().goals;

  return useMemo(
    () => goals.filter((goal) => goal.status === StatusTypes.ACTIVE),
    [goals],
  );
};
