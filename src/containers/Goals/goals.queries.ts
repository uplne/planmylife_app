import { useQuery } from "@tanstack/react-query";

import { idType } from "../../types/idtype";
import {
  fetchGoalsTasks,
  fetchGoalsTasksForWeek,
} from "./goals.tasks.controller";

export const useFetchGoalTasksData = (goalId: idType) =>
  useQuery({
    queryKey: ["goal", goalId],
    queryFn: () => fetchGoalsTasks(goalId),
    staleTime: 86400000, // set to 1 day
  });

export const useFetchGoalTasksDataForSelectedWeek = (selectedWeek: string) =>
  useQuery({
    queryKey: ["goal_tasks", selectedWeek],
    queryFn: () => fetchGoalsTasksForWeek(selectedWeek),
    staleTime: 86400000, // set to 1 day
  });
