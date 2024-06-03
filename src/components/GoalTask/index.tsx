import dayjs from "dayjs";

import { StatusTypes } from "../../types/status";
import { EditableInput } from "../../components/EditableInput";
import { GoalTaskActions } from "../Actions/GoalTasksActions";
import { GoalTasksTypes } from "../../store/Goals/api";
import type { goalTaskActionTypes } from "../Actions/types";
import { TagInProgress } from "../../components/TaskIndicator/TagInProgress";
import { SubTasks } from "../GoalSubTasks";
import { updateTask } from "../../containers/Goals/goals.tasks.controller";

type ComponentProps = {
  inactive?: boolean;
  data: GoalTasksTypes;
};

const allowTasks: goalTaskActionTypes[] = [
  "complete",
  "unComplete",
  "edit",
  "addSubtasks",
  "addToWeek",
  "removeFromWeek",
  "remove",
  "schedule",
];

const allowSubtasks: goalTaskActionTypes[] = [
  "complete",
  "unComplete",
  "edit",
  "schedule",
];

export const Task = ({ inactive = false, data }: ComponentProps) => {
  const shouldShowCompleted = () => {
    if (!data) {
      return false;
    }

    return data.status === StatusTypes.COMPLETED;
  };

  const isInProgress =
    data.assigned !== null &&
    typeof data.assigned !== "undefined" &&
    data.status !== StatusTypes.COMPLETED;

  const shouldShowReadOnly = () =>
    data && "isInactive" in data && data.isInactive;

  return (
    <div className="flex flex-col">
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
        {isInProgress && <TagInProgress date={dayjs(data.assigned).week()} />}
        {data.title && data && (
          <GoalTaskActions task={data} allow={allowTasks} />
        )}
      </div>
      <SubTasks data={data} />
    </div>
  );
};
