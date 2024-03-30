import { Link } from "react-router-dom";

import { ArrowCircleRight } from "../../Icons/ArrowCircleRight";
import { useWeekStore } from "../../../store/Week";
import { goToCurrentWeek } from "../controller";

import "./GoToCurrentWeek.css";

export const GoToCurrentWeek = () => {
  const { currentWeekId } = useWeekStore();
  const url = `/myweek?week=${currentWeekId}`;

  const onClick = async () => {
    await goToCurrentWeek();
  };

  return (
    <div className="gotoweek relative hover:translate-y-[-2px] transition-transform ease-in-out">
      <ArrowCircleRight className="w-4 h-4 mr-xs mt-[2px] fill-primary" />
      <Link
        className="gotoweek__link mt-[1px] hover:text-primary"
        to={url}
        onClick={onClick}
      >
        Go to Current Week
      </Link>
    </div>
  );
};
