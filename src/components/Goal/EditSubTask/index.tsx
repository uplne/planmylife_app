import { useEffect, useState } from "react";

import { Input } from "../../Input";
import { GoalSubTasksTypes } from "../../../store/Goals/api";
import { useGoalsStore } from "../../../store/Goals";

type ComponentProps = {
  data: GoalSubTasksTypes;
};

export const EditSubTask = ({ data }: ComponentProps) => {
  const [newTitle, setNewTitle] = useState(data.title);
  const updateTempSubTask = useGoalsStore().updateTempSubTask;
  const fillTempSubTask = useGoalsStore().fillTempSubTask;

  const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTempSubTask(data.subtaskId!, e.target.value);
    setNewTitle(e.target.value);
  };

  useEffect(() => {
    fillTempSubTask([data]);
  }, []);

  return (
    <div className="addsubtask">
      <div className="flex flex-row justify-between items-center p-5">
        <Input className="w-full" value={newTitle} onChange={inputOnChange} />
      </div>
    </div>
  );
};
