import dayjs from "dayjs";

import { ScheduleIcon } from "../../Icons/ScheduleIcon";

type ComponentProps = {
  date: dayjs.Dayjs;
};

export const DateTag = ({ date }: ComponentProps) => (
  <div className="text-xss text-left z-10 flex flex-row justify-start items-center bg-tag px-xs py-0 rounded-sm">
    {/* <ScheduleIcon className="w-[0.7rem] h-[0.8rem] mr-xs" /> */}
    {date.format("ddd, Do - H:mm")}
  </div>
);
