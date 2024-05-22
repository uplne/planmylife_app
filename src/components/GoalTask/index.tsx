import { StatusTypes } from "../../types/status";
import { EditableInput } from "../../components/EditableInput";
// import { AddTask } from '../Tasks/TaskModal/AddTask';
import { Actions } from "../Actions/GoalTasksActions";
import { GoalTasksTypes } from "../../store/Goals/api";
import type { goalTaskActionTypes } from "../Actions/types";
import { TagInProgress } from "../../components/TaskIndicator/TagInProgress";

type ComponentProps = {
  inactive?: boolean;
  data: GoalTasksTypes;
};

const allow: goalTaskActionTypes[] = [
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
      {isInProgress && <TagInProgress />}
      {data.title && data && <Actions task={data} allow={allow} />}
    </div>
  );
};