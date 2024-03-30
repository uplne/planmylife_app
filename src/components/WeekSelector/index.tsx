import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowIcon } from "../Icons/ArrowIcon";
import { GoToCurrentWeek } from "./GoToCurrentWeek";
import { GoToWeek } from "./GoToWeek";
import { IconButton } from "../Buttons/IconButton";
// import tabActiveEventManager from '../../utils/tabActiveEventManager';
import { useWeekStore } from "../../store/Week";

import "./WeekSelector.css";

export const WeekSelector = () => {
  const {
    selectedWeekNumber,
    selectedWeekStartPretty,
    selectedWeekEndPretty,
    showCurrentWeekLink,
    increaseWeek,
    decreaseWeek,
    nextWeekId,
    previousWeekId,
  } = useWeekStore();
  const navigate = useNavigate();

  useEffect(() => {
    // tabActiveEventManager.subscribe('tabactive', updateToday);
  }, []);

  const goToNextWeek = async () => {
    await increaseWeek();
    await navigate(`/myweek?week=${nextWeekId}`);
  };
  const goToPreviousWeek = async () => {
    await decreaseWeek();
    await navigate(`/myweek?week=${previousWeekId}`);
  };

  return (
    <div className="weekselector">
      <div className="weekselector__wrapper">
        <div className="weekselector__actions">
          <IconButton
            className="weekselector__button"
            onClick={goToPreviousWeek}
          >
            <ArrowIcon className="weekselector__arrow-icon" />
          </IconButton>
          <IconButton className="weekselector__button" onClick={goToNextWeek}>
            <ArrowIcon className="weekselector__arrow-icon" right />
          </IconButton>
        </div>
        <h1 className="weekselector__title">
          <div className="weekselector__title-wrap">
            Week {selectedWeekNumber}
            <span className="weekselector__subtitle">
              {selectedWeekStartPretty}{" "}
              <span className="weekselector__to">to</span>{" "}
              {selectedWeekEndPretty}
            </span>
          </div>
          <div className="weekselector__links">
            {showCurrentWeekLink && <GoToCurrentWeek />}
            <GoToWeek />
          </div>
        </h1>
      </div>
    </div>
  );
};
