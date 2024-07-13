import classnames from "classnames";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { CheckBoxIcon, CheckIcon } from "../../../../components/Icons";
import { GoalsAPITypes } from "../../../../store/Goals/api";
import {
  SchedulerTypeKey,
  SCHEDULER_OPTIONS,
  SchedulerPeriodKey,
  SchedulerTypeTitle,
} from "../../../../store/HabitScheduler";
import { toggleHabitFromGoal } from "../../../Goals/goals.habit.controller";
import { useWeekStore } from "../../../../store/Week";

dayjs.extend(utc);

export const Habit = ({ data }: { data: GoalsAPITypes }) => {
  const selectedWeek = useWeekStore().selectedWeek;
  const today = useWeekStore().today;

  return (
    <div className="flex flex-row justify-between py-5 px-15">
      {[...Array(7).keys()].map((_, index) => {
        const time = dayjs(selectedWeek)
          .clone()
          .startOf("week")
          .add(index, "days")
          .startOf("day");
        const habitDay =
          data.habitRepeatType === SchedulerTypeKey.AtLeast
            ? index
            : data.habitRepeatDays!.includes(index) && index;
        const isCompletedForTheDay =
          data.habitCompletedDays &&
          data.habitCompletedDays
            .map((item) => dayjs(item).format())
            .includes(
              dayjs(selectedWeek).weekday(index).startOf("day").format(),
            );

        const classes = classnames(
          "flex flex-col items-center text-xs text-tagText w-max-[7%] relative",
          {
            // 'habits__day--inactive': !habitDay || selectedWeek.isAfter(currentWeek, 'isoWeek'),
            // 'habits__day--completed': habitDay === 3,
            // 'habits__day--failed': habitDay === 2,
            "hover:[&_svg]:fill-[rgba(0,0,0,.3)]":
              habitDay !== false &&
              dayjs(selectedWeek).isSameOrBefore(today, "week"),
            // 'habits__day--nonClickable': 'completed' in task && task.completed,
          },
        );

        return (
          <div className="flex flex-col items-center text-xs py-5 px-10 text-tagText w-max-[7%]">
            {time.format("dd").substring(0, 1)}
            <div
              key={`${data.goalId}_${index}`}
              className={classes}
              onClick={() => toggleHabitFromGoal(data.goalId!, index)}
            >
              {habitDay !== false && (
                <CheckBoxIcon className="w-[14px] h-[14px] fill-[rgba(0,0,0,.1)] ml-[1px] cursor-pointer" />
              )}
              {habitDay !== false && isCompletedForTheDay && (
                <CheckIcon className="w-[14px] h-[14px] fill-progress absolute top-0 left-[1px]" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
