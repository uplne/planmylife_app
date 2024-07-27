import { GoalsAPITypes } from "../../../store/Goals/api";
import { Scheduler } from "../../Scheduler";

export type ComponentProps = {
  data?: Pick<
    GoalsAPITypes,
    | "habitRepeatType"
    | "habitRepeatPeriod"
    | "habitRepeatTimes"
    | "habitRepeatDays"
    | "habitCompletedDays"
  >;
};

export const AddHabit = ({ data }: ComponentProps) => {
  return (
    <div className="taskmodal">
      <div className="taskmodal__options-wrapper">
        <Scheduler data={data} />
      </div>
    </div>
  );
};
