import dayjs from "dayjs";

type ComponentProps = {
  date: dayjs.Dayjs;
};

export const DateTag = ({ date }: ComponentProps) => (
  <div className="text-[9px] text-left font-bold z-10 flex flex-row justify-start items-center px-10 py-[5px] uppercase rounded mr-5 bg-tag text-tagText">
    {/* <ScheduleIcon className="w-[0.7rem] h-[0.8rem] mr-xs" /> */}
    {date.format("ddd, Do - H:mm")}
  </div>
);
