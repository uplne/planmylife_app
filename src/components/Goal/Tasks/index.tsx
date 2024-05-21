import { goalTasksSelector } from "../../../store/Goals/selectors/goalTasksSelector";
import { GoalTasksTypes } from "../../../store/Goals/api";
import { idType } from "../../../types/idtype";
import { Task as TaskComponent } from "../../GoalTask";
import { useFetchGoalTasksData } from "../../../containers/Goals/goals.queries";

type ComponentProps = {
  goalId: idType;
};

export const Tasks = ({ goalId }: ComponentProps) => {
  const tasks = goalTasksSelector(goalId);

  useFetchGoalTasksData(goalId);

  let listClass = `relative before:absolute before:top-2/4 before:block before:content-[''] before:w-2 before:h-[1px] before:border-t before:border-0 before:border-solid before:border-borderSecondary first-of-type:after:absolute first-of-type:after:top-0 first-of-type:after:left-[-1px] first-of-type:after:block first-of-type:after:content-[''] first-of-type:after:w-[1px] first-of-type:after:h-[26px] first-of-type:after:bg-[white] last-of-type:after:absolute last-of-type:after:bottom-0 last-of-type:after:left-[-1px] last-of-type:after:block last-of-type:after:content-[''] last-of-type:after:w-[1px] last-of-type:after:h-[26px] last-of-type:after:bg-[white]`;

  if (tasks.length === 1) {
    listClass = `relative before:absolute before:top-2/4 before:block before:content-[''] before:w-2 before:h-[1px] before:border-t before:border-0 before:border-solid before:border-borderSecondary after:absolute after:top-0 after:left-[-1px] after:block after:content-[''] after:w-[1px] after:h-full after:bg-[white]`;
  }

  return (
    <ul className="list-none mx-0 px-0 border-l border-0 border-solid border-borderSecondary">
      {tasks.map((task: GoalTasksTypes) => {
        return (
          <li className={listClass}>
            <TaskComponent data={task} />
          </li>
        );
      })}
    </ul>
  );
};
