import { create } from 'zustand';
import moment from 'moment';

export const WEEK_ID_FORMAT = 'YYYY-MM-DD';

type WeekTypes = {
  selectedWeek: string,
  setSelectedWeek: (value: string) => void,
  today: moment.Moment,
  udpateToday: () => void,
  currentWeekId: string,
  selectedWeekNumber: number,
  selectedWeekStartPretty: string,
  selectedWeekEndPretty: string,
  showCurrentWeekLink: boolean,
  increaseWeek: () => void,
  decreaseWeek: () => void,
  nextWeekId: string,
  previousWeekId: string,
  reset: () => void,
};

const WeekDefault: WeekTypes = {
  selectedWeek: moment().toString(),
  today: moment(),
  setSelectedWeek: () => null,
  udpateToday: () => null,
  currentWeekId: moment().format(WEEK_ID_FORMAT),
  selectedWeekNumber: moment().week(),
  selectedWeekStartPretty: moment().clone().startOf('week').format('MMM D, YYYY'),
  selectedWeekEndPretty: moment().clone().endOf('week').format('MMM D, YYYY'),
  showCurrentWeekLink: !moment(moment().format(WEEK_ID_FORMAT)).isSame(moment(moment().toString()), 'week'),
  increaseWeek: () => null,
  decreaseWeek: () => null,
  nextWeekId: moment().clone().add(1, 'week').format(WEEK_ID_FORMAT),
  previousWeekId:  moment().clone().subtract(1, 'week').format(WEEK_ID_FORMAT),
  reset: () => null,
};

export const useWeekStore = create<WeekTypes>((set, get) => ({
  selectedWeek: WeekDefault.selectedWeek,
  selectedWeekNumber: WeekDefault.selectedWeekNumber,
  selectedWeekStartPretty: WeekDefault.selectedWeekStartPretty,
  selectedWeekEndPretty: WeekDefault.selectedWeekEndPretty,
  setSelectedWeek: async (value) => {
    const currentWeekId = get().currentWeekId;

    await set({
      selectedWeek: value,
      selectedWeekNumber: moment(value).week(),
      selectedWeekStartPretty: moment(value).clone().startOf('week').format('MMM D, YYYY'),
      selectedWeekEndPretty: moment(value).clone().endOf('week').format('MMM D, YYYY'),
      showCurrentWeekLink: !moment(currentWeekId).isSame(moment(value), 'week'),
      nextWeekId: moment(value).clone().add(1, 'week').format(WEEK_ID_FORMAT),
      previousWeekId: moment(value).clone().subtract(1, 'week').format(WEEK_ID_FORMAT),
    });
  },
  today: WeekDefault.today,
  udpateToday: async () => {
    await set({ 
      today: moment(),
      currentWeekId: moment().format(WEEK_ID_FORMAT),
    });
  },
  currentWeekId: WeekDefault.currentWeekId,
  nextWeekId: WeekDefault.nextWeekId,
  previousWeekId: WeekDefault.previousWeekId,
  showCurrentWeekLink: WeekDefault.showCurrentWeekLink,
  increaseWeek: async () => {
    const nextWeekId = await get().nextWeekId;

    await get().setSelectedWeek(nextWeekId);
    // yield put(push({
    //   pathname: '/myweek',
    //   search: `?week=${nextWeek}`,
    // }));
    // yield put({ type: 'week/weekSet' });
    return nextWeekId;
  },
  decreaseWeek: async () => {
    const previousWeekId = await get().previousWeekId;

    await get().setSelectedWeek(previousWeekId);
    // yield put(push({
    //   pathname: '/myweek',
    //   search: `?week=${nextWeek}`,
    // }));
    // yield put({ type: 'week/weekSet' });
  },
  reset: async () => {
    await set({
      selectedWeek: moment().toString(),
      today: moment(),
      currentWeekId: moment().format(WEEK_ID_FORMAT),
      selectedWeekNumber: moment().week(),
      selectedWeekStartPretty: moment().clone().startOf('week').format('MMM D, YYYY'),
      selectedWeekEndPretty: moment().clone().endOf('week').format('MMM D, YYYY'),
      showCurrentWeekLink: !moment(moment().format(WEEK_ID_FORMAT)).isSame(moment(moment().toString()), 'week'),
      nextWeekId: moment().clone().add(1, 'week').format(WEEK_ID_FORMAT),
      previousWeekId:  moment().clone().subtract(1, 'week').format(WEEK_ID_FORMAT),
    });
  },
}));