import { Link } from 'react-router-dom';

import { ArrowCircleRight } from '../../Icons/ArrowCircleRight';
import { useWeekStore } from '../../../store/Week';
import { goToCurrentWeek } from '../controller';

import './GoToCurrentWeek.css';

export const GoToCurrentWeek = () => {
  const { currentWeekId } = useWeekStore();
  const url = `/myweek?week=${currentWeekId}`;

  const onClick = async () => {
    await goToCurrentWeek();
  };

  return (
    <div className="gotoweek">
      <ArrowCircleRight />
      <Link
        className="gotoweek__link"
        to={url}
        onClick={onClick}
      >
      Go to Current Week
      </Link>
    </div>
  );
};
