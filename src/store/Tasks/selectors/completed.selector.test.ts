import { renderHook } from "@testing-library/react";

import { mockedTasksDataDefaultCompleted } from "../TasksStore.mock";
import { allCompletedTasksSelector } from "./completed.selector";
import { defaultCompletedTasksSelector } from "./default-completed.selector";

jest.mock("./default-completed.selector", () => ({
  defaultCompletedTasksSelector: jest.fn(),
}));

describe("allCompletedTasksSelector", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2023-01-11"));
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  xit("should return completed tasks only - if no data return an empty array", async () => {
    (defaultCompletedTasksSelector as unknown as jest.Mock).mockReturnValue([]);
    const { result } = renderHook(() => allCompletedTasksSelector());
    const data = result.current;

    expect(data).toStrictEqual([]);
  });

  xit("should return tasks from defaultCompletedTasksSelector", async () => {
    (defaultCompletedTasksSelector as unknown as jest.Mock).mockReturnValue(
      mockedTasksDataDefaultCompleted,
    );

    const { result } = renderHook(() => allCompletedTasksSelector());
    const data = result.current;

    expect(data.length).toBe(2);
  });

  it("should return sorted tasks based on the assign", async () => {
    (defaultCompletedTasksSelector as unknown as jest.Mock).mockReturnValue(
      mockedTasksDataDefaultCompleted,
    );

    const { result } = renderHook(() => allCompletedTasksSelector());
    const data = result.current;

    expect(data.length).toBe(2);
    expect(data[0]).toStrictEqual([mockedTasksDataDefaultCompleted[1]]);
  });
});
