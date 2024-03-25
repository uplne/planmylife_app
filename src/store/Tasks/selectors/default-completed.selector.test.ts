import dayjs from "dayjs";
import { renderHook } from "@testing-library/react";

import { defaultCompletedTasksSelector } from "./default-completed.selector";
import { mockedTaskDataDefault } from "../TasksStore.mock";
import { useWeekStore } from "../../Week";
import { useTasksStore } from "../index";

jest.mock("../../Week", () => ({
  useWeekStore: jest.fn(),
}));

jest.mock("../index", () => ({
  useTasksStore: jest.fn(),
}));

describe("defaultCompletedTasksSelector", () => {
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
    const { result } = renderHook(() => defaultCompletedTasksSelector());
    const data = result.current;

    expect(data).toStrictEqual([]);
  });

  it("should return completed tasks only", async () => {
    (useWeekStore as unknown as jest.Mock).mockReturnValue({
      selectedWeek: dayjs().format(),
    });
    (useTasksStore as unknown as jest.Mock).mockReturnValue({
      tasks: mockedTaskDataDefault,
    });

    const { result } = renderHook(() => defaultCompletedTasksSelector());
    const data = result.current;

    expect(data.length).toBe(1);
    expect(data).toStrictEqual([mockedTaskDataDefault[2]]);
  });

  it("should not return completed tasks if the selected week doesn't match", async () => {
    (useWeekStore as unknown as jest.Mock).mockReturnValue({
      selectedWeek: dayjs("2023-01-20").format(),
    });
    (useTasksStore as unknown as jest.Mock).mockReturnValue({
      tasks: mockedTaskDataDefault,
    });

    const { result } = renderHook(() => defaultCompletedTasksSelector());
    const data = result.current;

    expect(data.length).toBe(0);
    expect(data).toStrictEqual([]);
  });
});
