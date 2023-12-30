import { useState, useRef } from 'react';
import { DatePicker } from 'antd';
import 'moment/locale/en-gb';
import locale from 'antd/es/date-picker/locale/en_GB';

import { gotoSelectedWeek } from '../controller';
import { ArrowCircleRight } from '../../Icons/ArrowCircleRight';

import '../GoToCurrentWeek/GoToCurrentWeek.css';

export const GoToWeek = () => {
  const inputRef = useRef(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const onClick = () => {
    setShowCalendar(!showCalendar);
  };

  const calendarOnClick = async (date: any) => {
    await gotoSelectedWeek(date.toISOString());
    inputRef.current.blur();
  };

  return (
    <div className="gotoweek">
      <div className="gotoweek__wrapper" onClick={onClick}>
        <ArrowCircleRight />
        <DatePicker
          picker="week" 
          onChange={calendarOnClick}
          locale={locale}
          bordered={false}
          placeholder="Go to Week"
          value={null}
          ref={inputRef}
        />
      </div>
    </div>
  );
};
