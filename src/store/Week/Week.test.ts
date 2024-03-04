import dayjs from "dayjs";

import { useWeekStore, WEEK_ID_FORMAT } from "./index";

describe("Week store", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2023-01-10"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("setSelectedWeek", async () => {
    const setSelectedWeek = useWeekStore.getState().setSelectedWeek;

    await setSelectedWeek(dayjs().format());

    expect(useWeekStore.getState().selectedWeek).toBe(dayjs().format());
    expect(useWeekStore.getState().selectedWeekNumber).toBe(dayjs().week());
    expect(useWeekStore.getState().selectedWeekStartPretty).toBe(
      dayjs().clone().startOf("week").format("MMM D, YYYY"),
    );
    expect(useWeekStore.getState().selectedWeekEndPretty).toBe(
      dayjs().clone().endOf("week").format("MMM D, YYYY"),
    );
    expect(useWeekStore.getState().showCurrentWeekLink).toBe(
      !dayjs().isSame(dayjs("2023-02-10"), "week"),
    );
    expect(useWeekStore.getState().nextWeekId).toBe(
      dayjs().clone().add(1, "week").format(WEEK_ID_FORMAT),
    );
    expect(useWeekStore.getState().previousWeekId).toBe(
      dayjs().clone().subtract(1, "week").format(WEEK_ID_FORMAT),
    );
  });

  test("udpateToday", async () => {
    const udpateToday = useWeekStore.getState().udpateToday;

    await udpateToday();

    expect(useWeekStore.getState().today).toBe(dayjs("2023-01-10").format());

    jest.useFakeTimers().setSystemTime(new Date("2023-01-11"));

    await udpateToday();

    expect(useWeekStore.getState().today).toBe(dayjs("2023-01-11").format());
    expect(useWeekStore.getState().currentWeekId).toBe(
      dayjs("2023-01-11").format(WEEK_ID_FORMAT),
    );
  });

  test("increaseWeek", async () => {
    const increaseWeek = useWeekStore.getState().increaseWeek;
    const setSelectedWeek = useWeekStore.getState().setSelectedWeek;

    await setSelectedWeek(dayjs("2023-01-20").format());

    expect(useWeekStore.getState().nextWeekId).toBe("2023-01-27");

    const result = await increaseWeek();

    expect(result).toBe("2023-01-27");
    expect(useWeekStore.getState().nextWeekId).toBe("2023-02-03");
  });

  test("decreaseWeek", async () => {
    const decreaseWeek = useWeekStore.getState().decreaseWeek;
    const setSelectedWeek = useWeekStore.getState().setSelectedWeek;

    await setSelectedWeek(dayjs("2023-01-20").format());

    expect(useWeekStore.getState().previousWeekId).toBe("2023-01-13");

    const result = await decreaseWeek();

    expect(result).toBe("2023-01-13");
    expect(useWeekStore.getState().previousWeekId).toBe("2023-01-06");
  });

  test("reset", async () => {
    const reset = useWeekStore.getState().reset;

    jest.useFakeTimers().setSystemTime(new Date("2023-01-20"));

    await reset();

    expect(useWeekStore.getState().selectedWeek).toBe(
      "2023-01-20T00:00:00+00:00",
    );
    expect(useWeekStore.getState().selectedWeekId).toBe("2023-01-20");
    expect(useWeekStore.getState().today).toBe("2023-01-20T00:00:00+00:00");
    expect(useWeekStore.getState().currentWeekId).toBe("2023-01-20");
    expect(useWeekStore.getState().selectedWeekNumber).toBe(3);
    expect(useWeekStore.getState().selectedWeekStartPretty).toBe(
      "Jan 15, 2023",
    );
    expect(useWeekStore.getState().selectedWeekEndPretty).toBe("Jan 21, 2023");
    expect(useWeekStore.getState().showCurrentWeekLink).toBeFalsy();
    expect(useWeekStore.getState().nextWeekId).toBe("2023-01-27");
    expect(useWeekStore.getState().previousWeekId).toBe("2023-01-13");
  });
});
