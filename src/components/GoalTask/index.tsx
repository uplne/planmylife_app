import { StatusTypes } from "../../types/status";
import { EditableInput } from "../../components/EditableInput";
// import { AddTask } from '../Tasks/TaskModal/AddTask';
import { Actions } from "../Actions/GoalTasksActions";
import { GoalTasksTypes } from "../../store/Goals/api";

type ComponentProps = {
  inactive?: boolean;
  data: GoalTasksTypes;
};

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
      {data.title && data && <Actions task={data} />}
    </div>
  );
};
