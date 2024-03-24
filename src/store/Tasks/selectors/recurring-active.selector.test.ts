import dayjs from "dayjs";
import { renderHook } from "@testing-library/react";

import { allActiveRecurringTasksSelector } from "./recurring-active.selector";
import { mockedTaskDataRecurring } from "../TasksStore.mock";
import { useWeekStore } from "../../Week";
import { allRecurringTasksSelector } from "./recurring.selector";

jest.mock("../../Week", () => ({
  useWeekStore: jest.fn(),
}));

jest.mock("./recurring.selector", () => ({
  allRecurringTasksSelector: jest.fn(),
}));

describe("allActiveRecurringTasksSelector", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2023-01-11"));
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  it("should return an empty array", async () => {
    (useWeekStore as unknown as jest.Mock).mockReturnValue({
      selectedWeek: dayjs().format(),
    });
    (allRecurringTasksSelector as unknown as jest.Mock).mockReturnValue([]);
    const { result } = renderHook(() => allActiveRecurringTasksSelector());
    const data = result.current;

    expect(data).toStrictEqual([]);
  });

  it("should return ACTIVE tasks only", async () => {
    (useWeekStore as unknown as jest.Mock).mockReturnValue({
      selectedWeek: dayjs().format(),
    });
    (allRecurringTasksSelector as unknown as jest.Mock).mockReturnValue(
      mockedTaskDataRecurring,
    );
    const { result } = renderHook(() => allActiveRecurringTasksSelector());
    const data = result.current;

    expect(data.length).toBe(3);
  });

  it("should return sorted array based on assigned", async () => {
    (useWeekStore as unknown as jest.Mock).mockReturnValue({
      selectedWeek: dayjs().format(),
    });
    (allRecurringTasksSelector as unknown as jest.Mock).mockReturnValue(
      mockedTaskDataRecurring,
    );
    const { result } = renderHook(() => allActiveRecurringTasksSelector());
    const data = result.current;

    expect(data[0]).toStrictEqual(mockedTaskDataRecurring[1]);
  });

  it("should return when task is active and has some completed weeks but selected week hasn't been completed", async () => {
    (useWeekStore as unknown as jest.Mock).mockReturnValue({
      selectedWeek: dayjs().add(1, "week").format(),
    });
    (allRecurringTasksSelector as unknown as jest.Mock).mockReturnValue(
      mockedTaskDataRecurring,
    );
    const { result } = renderHook(() => allActiveRecurringTasksSelector());
    const data = result.current;

    expect(data.length).toBe(4);
  });
});
