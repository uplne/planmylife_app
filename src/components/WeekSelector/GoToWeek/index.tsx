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
      <div className="gotoweek__wrapper" onClick={onClick}>
        <ArrowCircleRight className="mt-[2px]" />
        <DatePicker
          className="bg-[transparent] border-0 hover:bg-[transparent]"
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
