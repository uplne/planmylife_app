import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import { StatusTypes } from "../../../types/status";
import { EditableInput } from "../../../components/EditableInput";
import { Actions } from "../../../components/Goal/Actions";
import { GoalsAPITypes } from "../../../store/Goals/api";
import { useGoalsStore } from "../../../store/Goals";
import { goalActionTypes } from "../../../components/Actions/types";
import { TaskStatus } from "../../../components/Tasks/TaskStatus";
import { TagHabit } from "../../../components/TaskIndicator/TagHabit";
import { updateGoal } from "../../Goals/goals.controller";
import { TagStatus } from "../../../components/TaskIndicator/TagStatus";
import {
  SchedulerTypeKey,
  SCHEDULER_OPTIONS,
  SchedulerPeriodKey,
  SchedulerTypeTitle,
} from "../../../store/HabitScheduler";
import { Habit } from "./Habit";

dayjs.extend(isSameOrBefore);

type ComponentProps = {
  inactive?: boolean;
  data: GoalsAPITypes;
  isHabit?: boolean;
};

const ALLOW = [
  goalActionTypes.COMPLETE,
  goalActionTypes.UNCOMPLETE,
  goalActionTypes.EDIT,
  goalActionTypes.ADDTOWEEK,
  goalActionTypes.REMOVEFROMWEEK,
  goalActionTypes.MOVE,
];

export const Goal = ({
  inactive = false,
  data,
  isHabit = false,
}: ComponentProps) => {
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

  const renderTag = () => {
    if (
      data.habitRepeatType === SchedulerTypeKey.Every &&
      data.habitRepeatPeriod !== null &&
      data.habitRepeatPeriod !== undefined
    ) {
      return (
        <TagStatus>
          every{" "}
          {
            SCHEDULER_OPTIONS[data.habitRepeatPeriod as SchedulerPeriodKey]
              .title
          }
        </TagStatus>
      );
    } else if (data.habitRepeatType === SchedulerTypeKey.AtLeast) {
      return (
        <TagStatus>{`${SchedulerTypeTitle.AtLeast} ${data.habitRepeatTimes}x per week`}</TagStatus>
      );
    }

    return <TaskStatus task={data} />;
  };

  return (
    <>
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
        <div className="absolute top-[-9px] right-[10px] flex flex-row">
          <TagHabit />
          {renderTag()}
        </div>
        <Actions goal={data} allow={ALLOW} />
      </div>
      {isHabit && <Habit data={data} />}
    </>
  );
};
