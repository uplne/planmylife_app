import { useWeekStore } from "../../store/Week";

export const goToCurrentWeek = async () => {
  const { currentWeekId, setSelectedWeek } = useWeekStore.getState();

  await setSelectedWeek(currentWeekId);

  // yield put({ type: 'week/weekSet' });
};

export const gotoSelectedWeek = async (value: string) => {
  const { setSelectedWeek } = useWeekStore.getState();
  await setSelectedWeek(value);
  // yield put({ type: 'week/weekSet' });
};
