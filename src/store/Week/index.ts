import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { create } from "zustand";
dayjs.extend(weekOfYear);

export const WEEK_ID_FORMAT = "YYYY-MM-DD";

type WeekTypes = {
  selectedWeek: string;
  selectedWeekId: string;
  setSelectedWeek: (value: string) => void;
  today: string;
  udpateToday: () => void;
  currentWeekId: string;
  selectedWeekNumber: number;
  selectedWeekStartPretty: string;
  selectedWeekEndPretty: string;
  showCurrentWeekLink: boolean;
  increaseWeek: () => void;
  decreaseWeek: () => void;
  nextWeekId: string;
  previousWeekId: string;
  reset: () => void;
};

export const WeekDefault: WeekTypes = {
  selectedWeek: dayjs().format(),
  selectedWeekId: dayjs().format(WEEK_ID_FORMAT),
  today: dayjs().format(),
  setSelectedWeek: () => null,
  udpateToday: () => null,
  currentWeekId: dayjs().format(WEEK_ID_FORMAT),
  selectedWeekNumber: dayjs().week(),
  selectedWeekStartPretty: dayjs()
    .clone()
    .startOf("week")
    .format("MMM D, YYYY"),
  selectedWeekEndPretty: dayjs().clone().endOf("week").format("MMM D, YYYY"),
  showCurrentWeekLink: !dayjs(dayjs().format(WEEK_ID_FORMAT)).isSame(
    dayjs(dayjs().toString()),
    "week",
  ),
  increaseWeek: () => null,
  decreaseWeek: () => null,
  nextWeekId: dayjs().clone().add(1, "week").format(WEEK_ID_FORMAT),
  previousWeekId: dayjs().clone().subtract(1, "week").format(WEEK_ID_FORMAT),
  reset: () => null,
};

export const useWeekStore = create<WeekTypes>((set, get) => ({
  selectedWeek: WeekDefault.selectedWeek,
  selectedWeekId: WeekDefault.selectedWeekId,
  selectedWeekNumber: WeekDefault.selectedWeekNumber,
  selectedWeekStartPretty: WeekDefault.selectedWeekStartPretty,
  selectedWeekEndPretty: WeekDefault.selectedWeekEndPretty,
  setSelectedWeek: async (value) => {
    const currentWeekId = get().currentWeekId;

    await set({
      selectedWeek: value,
      selectedWeekNumber: dayjs(value).week(),
      selectedWeekStartPretty: dayjs(value)
        .clone()
        .startOf("week")
        .format("MMM D, YYYY"),
      selectedWeekEndPretty: dayjs(value)
        .clone()
        .endOf("week")
        .format("MMM D, YYYY"),
      showCurrentWeekLink: !dayjs(currentWeekId).isSame(dayjs(value), "week"),
      nextWeekId: dayjs(value).clone().add(1, "week").format(WEEK_ID_FORMAT),
      previousWeekId: dayjs(value)
        .clone()
        .subtract(1, "week")
        .format(WEEK_ID_FORMAT),
    });
  },
  today: WeekDefault.today,
  udpateToday: async () => {
    await set({
      today: dayjs().format(),
      currentWeekId: dayjs().format(WEEK_ID_FORMAT),
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
    return previousWeekId;
  },
  reset: async () => {
    await set({
      selectedWeek: dayjs().format(),
      selectedWeekId: dayjs().format(WEEK_ID_FORMAT),
      today: dayjs().format(),
      currentWeekId: dayjs().format(WEEK_ID_FORMAT),
      selectedWeekNumber: dayjs().week(),
      selectedWeekStartPretty: dayjs()
        .clone()
        .startOf("week")
        .format("MMM D, YYYY"),
      selectedWeekEndPretty: dayjs()
        .clone()
        .endOf("week")
        .format("MMM D, YYYY"),
      showCurrentWeekLink: !dayjs(dayjs().format(WEEK_ID_FORMAT)).isSame(
        dayjs(dayjs().format()),
        "week",
      ),
      nextWeekId: dayjs().clone().add(1, "week").format(WEEK_ID_FORMAT),
      previousWeekId: dayjs()
        .clone()
        .subtract(1, "week")
        .format(WEEK_ID_FORMAT),
    });
  },
}));
