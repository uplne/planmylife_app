import dayjs from "dayjs";
import classnames from "classnames";

import { StatusTypes } from "../../../types/status";
import { EditableInput } from "../../../components/EditableInput";
// import { AddTask } from '../Tasks/TaskModal/AddTask';
import { GoalTaskActions } from "../../../components/Actions/GoalTasksActions";
import type { goalTaskActionTypes } from "../../../components/Actions/types";
import { GoalTasksTypes } from "../../../store/Goals/api";
import { TaskStatus } from "../../../components/Tasks/TaskStatus";
import { updateTask } from "../../Goals/goals.tasks.controller";
import { DateTag } from "../../../components/Tags/DateTag";

type ComponentProps = {
  inactive?: boolean;
  data: GoalTasksTypes;
};

const allow: goalTaskActionTypes[] = [
  "complete",
  "removeFromWeek",
  "move",
  "unComplete",
  "edit",
  "addSubtasks",
];

export const Task = ({ inactive = false, data }: ComponentProps) => {
  const shouldShowCompleted = () => {
    if (!data) {
      return false;
    }

    return data.status === StatusTypes.COMPLETED;
  };

  const classes = classnames(
    "flex flex-row justify-between items-center relative p-5",
    data.schedule && "mt-6",
  );

  return (
    <>
      <div className={classes}>
        <EditableInput
          id={String(data.taskId)}
          title={data.title}
          onBlur={(value) => updateTask(data.taskId!, value)}
          onFocus={() => {}} //onSave}
          status={data.status}
          isInactive={inactive}
          isCompleted={shouldShowCompleted()}
        />
        {data.title && data && <GoalTaskActions task={data} allow={allow} />}
      </div>
      {data.schedule && (
        <div className="absolute top-[-9px] left-sm z-10">
          <DateTag date={dayjs(data.schedule)} />
        </div>
      )}
      <TaskStatus task={data} />
    </>
  );
};
