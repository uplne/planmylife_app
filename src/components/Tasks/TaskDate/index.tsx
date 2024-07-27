import dayjs from "dayjs";

import { DateTag } from "../../Tags/DateTag";
import { TaskType } from "../../../store/Tasks";
import { TasksTypes } from "../../../types/status";

type ComponentProps = Pick<TaskType, "type" | "assigned" | "schedule">;

export const TaskDate = ({ type, assigned, schedule }: ComponentProps) => {
  if (
    type !== TasksTypes.SCHEDULED &&
    type !== TasksTypes.SCHEDULED_RECURRING
  ) {
    return null;
  }

  let date = dayjs(assigned).clone();

  if (type === TasksTypes.SCHEDULED_RECURRING) {
    date = dayjs(schedule).clone();
  }

  return (
    <div className="absolute top-[-9px] left-sm z-10">
      <DateTag date={date} />
    </div>
  );
};
