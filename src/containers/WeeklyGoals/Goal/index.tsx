import { StatusTypes } from "../../../types/status";
import { EditableInput } from "../../../components/EditableInput";
import { Actions } from "../../../components/Goal/Actions";
import { GoalsAPITypes } from "../../../store/Goals/api";
import { useGoalsStore } from "../../../store/Goals";
import { goalActionTypes } from "../../../components/Actions/types";
import { TaskStatus } from "../../../components/Tasks/TaskStatus";
import { updateGoal } from "../../Goals/goals.controller";

type ComponentProps = {
  inactive?: boolean;
  data: GoalsAPITypes;
};

const ALLOW = [
  goalActionTypes.COMPLETE,
  goalActionTypes.UNCOMPLETE,
  goalActionTypes.EDIT,
  goalActionTypes.ADDTOWEEK,
  goalActionTypes.REMOVEFROMWEEK,
  goalActionTypes.MOVE,
];

export const Goal = ({ inactive = false, data }: ComponentProps) => {
  const setTempGoal = useGoalsStore().setTempGoal;

  const shouldShowCompleted = () => {
    if (!data) {
      return false;
    }

    return data.status === StatusTypes.COMPLETED;
  };

  const saveHandler = async (value: string) => {
    await setTempGoal({
      ...data,
      objective: value,
    });
    await updateGoal(data.goalId!);
  };

  return (
    <div className="flex flex-row justify-between items-center p-5">
      <EditableInput
        id={String(data.goalId)}
        title={data.objective}
        onBlur={(value) => saveHandler(value)}
        onFocus={() => {}} //onSave}
        status={data.status}
        isInactive={inactive}
        isCompleted={shouldShowCompleted()}
      />
      <TaskStatus task={data} />
      <Actions goal={data} allow={ALLOW} />
    </div>
  );
};
