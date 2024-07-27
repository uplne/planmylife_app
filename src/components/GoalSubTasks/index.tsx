import { StatusTypes } from "../../types/status";
import { EditableInput } from "../EditableInput";
import { GoalSubtasksActions } from "../Actions/GoalSubtasksActions";
import { GoalSubTasksTypes, GoalTasksTypes } from "../../store/Goals/api";
import type { goalTaskActionTypes } from "../Actions/types";
import { TaskList } from "../TaskList/TaskList";
import { TaskListItem } from "../TaskList/TaskListItem";
import { updateSubTask } from "../../containers/Goals/goals.subtasks.controller";

type ComponentProps = {
  data: GoalTasksTypes;
};

const allowSubtasks: goalTaskActionTypes[] = [
  "complete",
  "unComplete",
  "edit",
  "schedule",
  "remove",
];

const copyOverride = {
  remove: "Remove subtask",
};

export const SubTasks = ({ data }: ComponentProps) => {
  if (
    !data?.subtasks ||
    (data?.subtasks && !(data.subtasks instanceof Array))
  ) {
    return null;
  }

  return (
    <>
      {data.subtasks.length > 0 && (
        <TaskList isSub>
          {data.subtasks.map((subtask: GoalSubTasksTypes) => (
            <TaskListItem isSub length={data.subtasks.length}>
              <div className="flex flex-row justify-between items-center p-5">
                <EditableInput
                  id={subtask.subtaskId!}
                  title={subtask.title}
                  onBlur={(value) => updateSubTask(subtask, value)}
                  onFocus={() => {}} //onSave}
                  isCompleted={subtask.status === StatusTypes.COMPLETED}
                />
                <GoalSubtasksActions
                  task={subtask}
                  allow={allowSubtasks}
                  copy={copyOverride}
                />
              </div>
            </TaskListItem>
          ))}
        </TaskList>
      )}
    </>
  );
};
