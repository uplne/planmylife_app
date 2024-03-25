import dayjs from "dayjs";

import { DateTag } from "../../Tags/DateTag";
import { TaskType } from "../../../store/Tasks";
import { TasksTypes } from "../../../types/status";

type ComponentProps = {
  task: TaskType;
};

export const TaskDate = ({ task }: ComponentProps) => {
  if (
    task.type !== TasksTypes.SCHEDULE &&
    task.type !== TasksTypes.SCHEDULED_RECURRING
  ) {
    return null;
  }

  const date = dayjs(task.assigned).clone();

  return (
    <div className="absolute top-[-9px] left-sm">
      <DateTag date={date} />
    </div>
  );
};
