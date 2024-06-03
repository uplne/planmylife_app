import { useEffect, useRef } from "react";
import { SimpleInput } from "../../SimpleInput";
import { GoalTasksTypes } from "../../../store/Goals/api";

import { useGoalsStore } from "../../../store/Goals";

type ComponentProps = {
  editMode?: boolean;
  data: GoalTasksTypes;
};

export const AddGoalTask = ({ data, editMode = false }: ComponentProps) => {
  const tempTask = useGoalsStore().tempTask;
  const setTempTask = useGoalsStore().setTempTask;
  const LABEL = "Add task";

  const inputRef = useRef<HTMLInputElement | null>(null);

  const onChange = async (e: React.FormEvent<HTMLInputElement>) => {
    await setTempTask((e.target as HTMLInputElement).value);
  };

  useEffect(() => {
    setTempTask("");
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
    setTempTask((editMode && data && data.title) || "");

    return () => {
      setTempTask("");
    };
  }, []);

  return (
    <div className="taskmodal">
      <div className="taskmodal__options-wrapper">
        <h4>Task</h4>
        <SimpleInput value={tempTask} onChange={onChange} placeholder={LABEL} />
      </div>
    </div>
  );
};
