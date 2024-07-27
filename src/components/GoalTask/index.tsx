import dayjs from "dayjs";

import { StatusTypes } from "../../types/status";
import { EditableInput } from "../../components/EditableInput";
import { GoalTaskActions } from "../Actions/GoalTasksActions";
import { GoalTasksTypes } from "../../store/Goals/api";
import type { goalTaskActionTypes } from "../Actions/types";
import { TagInProgress } from "../../components/TaskIndicator/TagInProgress";
import { DateTag } from "../../components/Tags/DateTag";
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

  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-between items-start p-5">
        <div className="flex flex-row justify-between w-full">
          <EditableInput
            id={String(data.taskId)}
            title={data.title}
            onBlur={(value) => updateTask(data.taskId!, value)}
            onFocus={() => {}} //onSave}
            status={data.status}
            isInactive={inactive}
            isCompleted={shouldShowCompleted()}
          />
          {data.title && data && (
            <GoalTaskActions task={data} allow={allowTasks} />
          )}
        </div>
        <div className="flex flex-row ml-5 mb-5">
          {isInProgress && <TagInProgress date={dayjs(data.assigned).week()} />}
          {data.assigned && <DateTag date={dayjs(data.assigned)} />}
        </div>
      </div>
      <SubTasks data={data} />
    </div>
  );
};
