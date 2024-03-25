import dayjs from "dayjs";
import { renderHook } from "@testing-library/react";

import { allRecurringTasksSelector } from "./recurring.selector";
import {
  mockedTaskDataRecurring,
  mockedTaskDataRecurringYearly,
  mockedTaskDataRecurringMonthly,
  mockedTaskDataRecurringWeekly,
} from "../TasksStore.mock";
import { useWeekStore } from "../../Week";
import { useTasksStore } from "../index";

jest.mock("../../Week", () => ({
  useWeekStore: jest.fn(),
}));

jest.mock("../index", () => ({
  useTasksStore: jest.fn(),
}));

describe("allRecurringTasksSelector", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2023-01-11"));
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  it("should return an empty array for no data", async () => {
    (useWeekStore as unknown as jest.Mock).mockReturnValue({
      selectedWeek: dayjs().format(),
    });
    (useTasksStore as unknown as jest.Mock).mockReturnValue({
      tasks: [],
    });
    const { result } = renderHook(() => allRecurringTasksSelector());
    const data = result.current;

    expect(data).toStrictEqual([]);
  });

  it("should return recurring tasks", async () => {
    (useWeekStore as unknown as jest.Mock).mockReturnValue({
      selectedWeek: dayjs().format(),
    });
    (useTasksStore as unknown as jest.Mock).mockReturnValue({
      tasks: mockedTaskDataRecurring,
    });
    const { result } = renderHook(() => allRecurringTasksSelector());
    const data = result.current;

    expect(data.length).toBe(4);
  });

  it("should repeat every week", async () => {
    (useWeekStore as unknown as jest.Mock).mockReturnValue({
      selectedWeek: dayjs().add(1, "week").format(),
    });
    (useTasksStore as unknown as jest.Mock).mockReturnValue({
      tasks: mockedTaskDataRecurring,
    });
    const { result } = renderHook(() => allRecurringTasksSelector());
    const data = result.current;

    expect(data.length).toBe(1);
  });

  it("should repeat every month - includes COMPLETED", async () => {
    (useWeekStore as unknown as jest.Mock).mockReturnValue({
      selectedWeek: dayjs().add(1, "month").format(),
    });
    (useTasksStore as unknown as jest.Mock).mockReturnValue({
      tasks: mockedTaskDataRecurring,
    });
    const { result } = renderHook(() => allRecurringTasksSelector());
    const data = result.current;

    expect(data.length).toBe(4);
  });

  describe("Yearly recurring", () => {
    test("should show yearly recurring task", () => {
      (useWeekStore as unknown as jest.Mock).mockReturnValue({
        selectedWeek: dayjs().format(),
      });
      (useTasksStore as unknown as jest.Mock).mockReturnValue({
        tasks: mockedTaskDataRecurringYearly,
      });
      const { result } = renderHook(() => allRecurringTasksSelector());
      const data = result.current;

      expect(data.length).toBe(1);
    });

    test("should not show it next week", () => {
      (useWeekStore as unknown as jest.Mock).mockReturnValue({
        selectedWeek: dayjs().add(1, "week").format(),
      });
      (useTasksStore as unknown as jest.Mock).mockReturnValue({
        tasks: mockedTaskDataRecurringYearly,
      });
      const { result } = renderHook(() => allRecurringTasksSelector());
      const data = result.current;

      expect(data.length).toBe(0);
    });

    test("should show it next year", () => {
      (useWeekStore as unknown as jest.Mock).mockReturnValue({
        selectedWeek: dayjs().add(1, "year").format(),
      });
      (useTasksStore as unknown as jest.Mock).mockReturnValue({
        tasks: mockedTaskDataRecurringYearly,
      });
      const { result } = renderHook(() => allRecurringTasksSelector());
      const data = result.current;

      expect(data.length).toBe(1);
    });
  });

  describe("Monthly recurring", () => {
    test("should show monthly recurring task", () => {
      (useWeekStore as unknown as jest.Mock).mockReturnValue({
        selectedWeek: dayjs().format(),
      });
      (useTasksStore as unknown as jest.Mock).mockReturnValue({
        tasks: mockedTaskDataRecurringMonthly,
      });
      const { result } = renderHook(() => allRecurringTasksSelector());
      const data = result.current;

      expect(data.length).toBe(2);
    });

    test("should not show it next week", () => {
      (useWeekStore as unknown as jest.Mock).mockReturnValue({
        selectedWeek: dayjs().add(1, "week").format(),
      });
      (useTasksStore as unknown as jest.Mock).mockReturnValue({
        tasks: mockedTaskDataRecurringMonthly,
      });
      const { result } = renderHook(() => allRecurringTasksSelector());
      const data = result.current;

      expect(data.length).toBe(0);
    });

    test("should every month", () => {
      (useWeekStore as unknown as jest.Mock).mockReturnValue({
        selectedWeek: dayjs().add(1, "month").format(),
      });
      (useTasksStore as unknown as jest.Mock).mockReturnValue({
        tasks: mockedTaskDataRecurringMonthly,
      });
      const { result } = renderHook(() => allRecurringTasksSelector());
      const data = result.current;

      expect(data.length).toBe(1);
    });

    test("should every x months", () => {
      (useWeekStore as unknown as jest.Mock).mockReturnValue({
        selectedWeek: dayjs().add(2, "month").format(),
      });
      (useTasksStore as unknown as jest.Mock).mockReturnValue({
        tasks: mockedTaskDataRecurringMonthly,
      });
      const { result } = renderHook(() => allRecurringTasksSelector());
      const data = result.current;

      expect(data.length).toBe(2);
    });
  });

  describe("Weekly recurring", () => {
    test("should show weekly recurring task", () => {
      (useWeekStore as unknown as jest.Mock).mockReturnValue({
        selectedWeek: dayjs().format(),
      });
      (useTasksStore as unknown as jest.Mock).mockReturnValue({
        tasks: mockedTaskDataRecurringWeekly,
      });
      const { result } = renderHook(() => allRecurringTasksSelector());
      const data = result.current;

      expect(data.length).toBe(2);
    });

    test("should not show it next week", () => {
      (useWeekStore as unknown as jest.Mock).mockReturnValue({
        selectedWeek: dayjs().add(1, "week").format(),
      });
      (useTasksStore as unknown as jest.Mock).mockReturnValue({
        tasks: mockedTaskDataRecurringWeekly,
      });
      const { result } = renderHook(() => allRecurringTasksSelector());
      const data = result.current;

      expect(data.length).toBe(2);
    });

    test("should every x weeks", () => {
      (useWeekStore as unknown as jest.Mock).mockReturnValue({
        selectedWeek: dayjs().add(2, "weeks").format(),
      });
      (useTasksStore as unknown as jest.Mock).mockReturnValue({
        tasks: mockedTaskDataRecurringWeekly,
      });
      const { result } = renderHook(() => allRecurringTasksSelector());
      const data = result.current;

      expect(data.length).toBe(3);
    });

    test("should not show for completed week", () => {
      (useWeekStore as unknown as jest.Mock).mockReturnValue({
        selectedWeek: dayjs().format(),
      });
      (useTasksStore as unknown as jest.Mock).mockReturnValue({
        tasks: mockedTaskDataRecurringWeekly,
      });
      const { result } = renderHook(() => allRecurringTasksSelector());
      const data = result.current;

      expect(data.length).toBe(2);
    });
  });
});
