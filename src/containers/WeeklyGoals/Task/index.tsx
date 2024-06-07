import { StatusTypes } from "../../../types/status";
import { EditableInput } from "../../../components/EditableInput";
// import { AddTask } from '../Tasks/TaskModal/AddTask';
import { GoalTaskActions } from "../../../components/Actions/GoalTasksActions";
import type { goalTaskActionTypes } from "../../../components/Actions/types";
import { GoalTasksTypes } from "../../../store/Goals/api";
import { TaskStatus } from "../../../components/Tasks/TaskStatus";
import { updateTask } from "../../Goals/goals.tasks.controller";

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

  return (
    <div className="flex flex-row justify-between items-center p-5">
      <EditableInput
        id={String(data.taskId)}
        title={data.title}
        onBlur={(value) => updateTask(data.taskId!, value)}
        onFocus={() => {}} //onSave}
        status={data.status}
        isInactive={inactive}
        isCompleted={shouldShowCompleted()}
      />
      <TaskStatus task={data} />
      {data.title && data && <GoalTaskActions task={data} allow={allow} />}
    </div>
  );
};
