import { Box } from "../../components/Box";
import { SubHeading } from "../../components/SubHeading";
import { TasksBox } from "../../components/TasksBox";
import { Preloader } from "../../components/Preloader";
import { useWeekStore } from "../../store/Week";
import {
  useFetchGoalTasksDataForSelectedWeek,
  useFetchGoalsDataForSelectedWeek,
} from "../Goals/goals.queries";
import { useIsLoading } from "./useIsLoading";
import { Task as TaskComponent } from "./Task";
import { Goal as GoalComponent } from "./Goal";
import { allDefaultTasksSelector } from "../../store/Goals/selectors/default.selector";
import { allCompletedTasksSelector } from "../../store/Goals/selectors/completed.selector";
import { habitGoalSelector } from "../../store/Goals/selectors/habitGoal.selector";

export const WeeklyGoals = () => {
  const selectedWeek = useWeekStore().selectedWeek;
  const tasks = allDefaultTasksSelector();
  const completedTasks = allCompletedTasksSelector();
  const habits = habitGoalSelector();

  const isLoading = useIsLoading();

  useFetchGoalTasksDataForSelectedWeek(selectedWeek);
  useFetchGoalsDataForSelectedWeek(selectedWeek);

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
                {tasks.map((task) => {
                  if ("taskId" in task) {
                    return (
                      <div className="tasks__container">
                        <TaskComponent key={String(task.taskId)} data={task} />
                      </div>
                    );
                  } else {
                    return (
                      <div className="tasks__container">
                        <GoalComponent key={String(task.goalId)} data={task} />
                      </div>
                    );
                  }
                })}
              </>
            )}
            {habits.length > 0 && (
              <>
                <h3 className="tasks__subtitle">Recurring goals</h3>
                {habits.map((task) => (
                  <div className="tasks__container">
                    <GoalComponent
                      isHabit
                      key={String(task.goalId)}
                      data={task}
                    />
                  </div>
                ))}
              </>
            )}
            {completedTasks.length > 0 && (
              <>
                <h3 className="tasks__subtitle">Completed</h3>
                {completedTasks.map((task) => {
                  if ("taskId" in task) {
                    return (
                      <div className="tasks__container">
                        <TaskComponent key={String(task.taskId)} data={task} />
                      </div>
                    );
                  } else {
                    return (
                      <div className="tasks__container">
                        <GoalComponent key={String(task.goalId)} data={task} />
                      </div>
                    );
                  }
                })}
              </>
            )}
          </>
        )}
      </Box>
    </TasksBox>
  );
};
