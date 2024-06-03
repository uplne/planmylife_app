import { goalTasksSelector } from "../../../store/Goals/selectors/goalTasksSelector";
import { GoalTasksTypes } from "../../../store/Goals/api";
import { idType } from "../../../types/idtype";
import { Task as TaskComponent } from "../../GoalTask";
import { useFetchGoalTasksData } from "../../../containers/Goals/goals.queries";
import { TaskList } from "../../TaskList/TaskList";
import { TaskListItem } from "../../TaskList/TaskListItem";

type ComponentProps = {
  goalId: idType;
};

export const Tasks = ({ goalId }: ComponentProps) => {
  const tasks = goalTasksSelector(goalId);

  useFetchGoalTasksData(goalId);

  return (
    <TaskList>
      {tasks.map((task: GoalTasksTypes) => {
        return (
          <TaskListItem length={tasks.length}>
            <TaskComponent data={task} />
          </TaskListItem>
        );
      })}
    </TaskList>
  );
};
