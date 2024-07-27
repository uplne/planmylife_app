import { useEffect } from "react";

import { EditableInput } from "../../EditableInput";
import { GoalTasksTypes } from "../../../store/Goals/api";
import { useGoalsStore } from "../../../store/Goals";
import { TaskList } from "../../TaskList/TaskList";
import { TaskListItem } from "../../TaskList/TaskListItem";

type ComponentProps = {
  data: GoalTasksTypes;
};

export const AddSubTask = ({ data }: ComponentProps) => {
  const setTempSubTask = useGoalsStore().setTempSubTask;
  const fillTempSubTask = useGoalsStore().fillTempSubTask;
  const resetTempSubTasks = useGoalsStore().resetTempSubTasks;
  const tempSubTasks = useGoalsStore().tempSubTasks;

  useEffect(() => {
    fillTempSubTask(data.subtasks);

    return () => {
      resetTempSubTasks();
    };
  }, []);

  return (
    <div className="addsubtask">
      <h3>For:</h3>
      <p>{data.title}</p>
      <TaskList>
        {Array.from(tempSubTasks).map(([key, subtask]) => (
          <TaskListItem length={Array.from(tempSubTasks).length} isSub>
            <div className="flex flex-row justify-between items-center p-5">
              <EditableInput
                id={key}
                title={subtask.title}
                onBlur={(value) => setTempSubTask(key, value)}
                onFocus={() => {}} //onSave}
              />
            </div>
          </TaskListItem>
        ))}
      </TaskList>
      <EditableInput
        id={String(data.taskId)}
        title="Add new subtask"
        onBlur={(value) => setTempSubTask("", value)}
        onFocus={() => {}} //onSave}
        status={data.status}
      />
    </div>
  );
};
