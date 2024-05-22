import { StatusTypes } from "../../../types/status";
import { EditableInput } from "../../../components/EditableInput";
// import { AddTask } from '../Tasks/TaskModal/AddTask';
import { Actions } from "../../../components/Actions/GoalTasksActions";
import type { goalTaskActionTypes } from "../../../components/Actions/types";
import { GoalTasksTypes } from "../../../store/Goals/api";
import { TagMoved } from "../../../components/TaskIndicator/TagMoved";
import { TaskStatus } from "../../../components/Tasks/TaskStatus";

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

  const shouldShowReadOnly = () =>
    data && "isInactive" in data && data.isInactive;

  // type OnSaveTypes = {
  //   id: idType,
  //   title: string,
  // };

  // const onSave = ({ id, title }: OnSaveTypes) => {
  //   // dispatch({ type: 'tasks/saveTasks', payload: {
  //   //   id,
  //   //   title,
  //   // }});
  // };

  return (
    <div className="flex flex-row justify-between items-center p-5">
      <EditableInput
        id={String(data.taskId)}
        title={data.title}
        onBlur={() => {}} //onSave}
        onFocus={() => {}} //onSave}
        status={data.status}
        isInactive={inactive}
        isCompleted={shouldShowCompleted()}
      />
      <TaskStatus task={data} />
      {data.title && data && <Actions task={data} allow={allow} />}
    </div>
  );
};
