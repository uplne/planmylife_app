import classnames from "classnames";

import { TasksTypes, StatusTypes } from "../../types/status";
import { EditableInput } from "../../components/EditableInput";
// import { AddTask } from '../Tasks/TaskModal/AddTask';
import { Actions } from "../Actions/TaskActions";

import { idType } from "../../types/idtype";
import { TaskType } from "../../store/Tasks/index";

import "./Task.css";

const LABEL = "Add task";

type ComponentProps = {
  title: string | undefined;
  id: idType;
  status: StatusTypes;
  className?: string | undefined;
  inactive?: boolean;
  noActions?: boolean;
  rawTaskData: TaskType | null;
  isCompleted?: boolean;
};

export const Task = ({
  id,
  status,
  title = undefined,
  className = undefined,
  inactive = false,
  noActions = false,
  rawTaskData = null,
  isCompleted = false,
}: ComponentProps) => {
  const shouldShowCompleted = () => {
    if (!rawTaskData) {
      return false;
    }

    if (
      rawTaskData.type !== TasksTypes.RECURRING &&
      rawTaskData.type !== TasksTypes.SCHEDULED_RECURRING
    ) {
      return rawTaskData.status === StatusTypes.COMPLETED;
    } else {
      if ("isInactive" in rawTaskData) {
        return false;
      } else if (isCompleted) {
        return true;
      } else {
        return rawTaskData.status === StatusTypes.COMPLETED;
      }
    }
  };

  const shouldShowReadOnly = () =>
    rawTaskData &&
    (rawTaskData.type === TasksTypes.RECURRING ||
      rawTaskData.type === TasksTypes.SCHEDULED_RECURRING) &&
    "isInactive" in rawTaskData &&
    rawTaskData.isInactive;

  const taskClasses = classnames("task", className, {
    "task--hasTask": title,
    "task--isCompleted": shouldShowCompleted(),
    "task--isInactive": shouldShowReadOnly(),
    "task--isPlaceholder": !title,
    "mt-6":
      rawTaskData?.type === TasksTypes.SCHEDULED ||
      rawTaskData?.type === TasksTypes.SCHEDULED_RECURRING,
  });

  return (
    <div className={taskClasses}>
      <EditableInput
        id={id}
        title={title}
        label={LABEL}
        onBlur={() => {}} //onSave}
        onFocus={() => {}} //onSave}
        status={status}
        isInactive={inactive}
        isCompleted={shouldShowCompleted()}
      />
      {title && !noActions && rawTaskData && <Actions task={rawTaskData} />}
    </div>
  );
};
