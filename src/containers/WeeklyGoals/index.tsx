import { Box } from "../../components/Box";
import { SubHeading } from "../../components/SubHeading";
import { TasksBox } from "../../components/TasksBox";
import { Preloader } from "../../components/Preloader";
import { useWeekStore } from "../../store/Week";
import { useFetchGoalTasksDataForSelectedWeek } from "../Goals/goals.queries";
import { useIsLoading } from "./useIsLoading";
import { Task as TaskComponent } from "./Task";
import { allDefaultTasksSelector } from "../../store/Goals/selectors/default.selector";
import { allCompletedTasksSelector } from "../../store/Goals/selectors/completed.selector";

export const WeeklyGoals = () => {
  const selectedWeek = useWeekStore().selectedWeek;
  const tasks = allDefaultTasksSelector();
  const completedTasks = allCompletedTasksSelector();

  console.log("completedTasks: ", completedTasks);

  const isLoading = useIsLoading();

  useFetchGoalTasksDataForSelectedWeek(selectedWeek);

  return (
    <TasksBox>
      <Box>
        <SubHeading>Goals and Projects</SubHeading>
        {isLoading && <Preloader small />}
        {!isLoading && (
          <>
            {tasks.length > 0 && (
              <>
                <h3 className="tasks__subtitle">This week</h3>
                {tasks.map((task) => (
                  <div className="tasks__container">
                    <TaskComponent key={String(task.taskId)} data={task} />
                  </div>
                ))}
              </>
            )}
            {completedTasks.length > 0 && (
              <>
                <h3 className="tasks__subtitle">Completed</h3>
                {completedTasks.map((task) => (
                  <div className="tasks__container">
                    <TaskComponent key={String(task.taskId)} data={task} />
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </Box>
    </TasksBox>
  );
};
