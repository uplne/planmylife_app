import dayjs from "dayjs";
import { renderHook } from "@testing-library/react";

import { allDefaultTasksSelector } from "./default.selector";
import {
  mockedTaskDataDefault,
  mockedTaskDataRecurring,
} from "../TasksStore.mock";
import { useWeekStore } from "../../Week";
import { useTasksStore } from "../index";
import { allRecurringTasksSelector } from "./recurring.selector";

jest.mock("../../Week", () => ({
  useWeekStore: jest.fn(),
}));

jest.mock("../index", () => ({
  useTasksStore: jest.fn(),
}));

jest.mock("./recurring.selector", () => ({
  allRecurringTasksSelector: jest.fn(),
}));

describe("allDefaultTasksSelector", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2023-01-11"));
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  it("should return completed tasks only - if no data return an empty array", async () => {
    (useWeekStore as unknown as jest.Mock).mockReturnValue({
      selectedWeek: dayjs().format(),
    });
    (useTasksStore as unknown as jest.Mock).mockReturnValue({
      tasks: [],
    });
    (allRecurringTasksSelector as unknown as jest.Mock).mockReturnValue([]);
    const { result } = renderHook(() => allDefaultTasksSelector());
    const data = result.current;

    expect(data).toStrictEqual([]);
  });

  it("should return default tasks only", async () => {
    (useWeekStore as unknown as jest.Mock).mockReturnValue({
      selectedWeek: dayjs().format(),
    });
    (useTasksStore as unknown as jest.Mock).mockReturnValue({
      tasks: mockedTaskDataDefault,
    });
    (allRecurringTasksSelector as unknown as jest.Mock).mockReturnValue([]);

    const { result } = renderHook(() => allDefaultTasksSelector());
    const data = result.current;

    expect(data.length).toBe(2);
  });

  it("should be sorted based on assigned date", async () => {
    (useWeekStore as unknown as jest.Mock).mockReturnValue({
      selectedWeek: dayjs().format(),
    });
    (useTasksStore as unknown as jest.Mock).mockReturnValue({
      tasks: mockedTaskDataDefault,
    });
    (allRecurringTasksSelector as unknown as jest.Mock).mockReturnValue([]);

    const { result } = renderHook(() => allDefaultTasksSelector());
    const data = result.current;

    expect(data[0]).toBe(mockedTaskDataDefault[1]);
  });

  it("should include recurring tasks", async () => {
    (useWeekStore as unknown as jest.Mock).mockReturnValue({
      selectedWeek: dayjs().format(),
    });
    (useTasksStore as unknown as jest.Mock).mockReturnValue({
      tasks: mockedTaskDataDefault,
    });
    (allRecurringTasksSelector as unknown as jest.Mock).mockReturnValue([
      mockedTaskDataRecurring[0],
    ]);

    const { result } = renderHook(() => allDefaultTasksSelector());
    const data = result.current;

    expect(data.length).toBe(3);
    expect(data[2].type).toBe("RECURRING");
  });
});
