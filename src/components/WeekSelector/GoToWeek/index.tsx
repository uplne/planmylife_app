import { useState, useRef } from "react";
import { DatePicker } from "antd";
import locale from "antd/es/date-picker/locale/en_GB";

import { gotoSelectedWeek } from "../controller";
import { ArrowCircleRight } from "../../Icons/ArrowCircleRight";

import "../GoToCurrentWeek/GoToCurrentWeek.css";

export const GoToWeek = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const onClick = () => {
    setShowCalendar(!showCalendar);
  };

  const calendarOnClick = async (date: any) => {
    await gotoSelectedWeek(date.toISOString());

    if (inputRef && inputRef.current) {
      inputRef.current.blur();
    }
  };

  return (
    <div className="gotoweek">
      <div
        className="gotoweek__wrapper relative hover:translate-y-[-2px] transition-transform ease-in-out"
        onClick={onClick}
      >
        <ArrowCircleRight className="w-4 h-4 mr-xs mt-[2px] fill-primary" />
        <DatePicker
          className="bg-[transparent] border-0 hover:bg-[transparent] focus:border-0 focus:bg-[transparent] focus:shadow-none"
          picker="week"
          onChange={calendarOnClick}
          locale={locale}
          placeholder="Go to Week"
          value={null}
        />
      </div>
    </div>
  );
};
