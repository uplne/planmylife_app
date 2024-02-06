import { useTasksStore } from "../../store/Tasks";
import {
  DATA_FETCHING_STATUS,
  StatusTypes,
  TasksTypes,
} from "../../types/status";
import { mockedTaskDataDefault } from "../../store/Tasks/TasksStore.mock";
import dayjs from "dayjs";

describe("Tasks store", () => {
  test("Default store state", () => {
    expect(useTasksStore.getState().isLoading).toBe(
      DATA_FETCHING_STATUS.NODATA,
    );
    expect(useTasksStore.getState().tasks).toStrictEqual([]);
    expect(useTasksStore.getState().newTask).toBe("");
    expect(useTasksStore.getState().schedule).toBe(undefined);
  });

  test("Update is loading", () => {
    expect(useTasksStore.getState().isLoading).toBe(
      DATA_FETCHING_STATUS.NODATA,
    );

    useTasksStore.getState().updateIsLoading(DATA_FETCHING_STATUS.FETCHING);

    expect(useTasksStore.getState().isLoading).toBe(
      DATA_FETCHING_STATUS.FETCHING,
    );
  });

  test("fillTasks", async () => {
    expect(useTasksStore.getState().tasks).toStrictEqual([]);

    await useTasksStore.setState({
      tasks: [mockedTaskDataDefault[0]],
    });
    await useTasksStore.getState().fillTasks(mockedTaskDataDefault);

    expect(useTasksStore.getState().tasks).toStrictEqual(mockedTaskDataDefault);
  });

  test("Update newTask", () => {
    expect(useTasksStore.getState().newTask).toBe("");

    useTasksStore.getState().updateNewTask("New task test");

    expect(useTasksStore.getState().newTask).toBe("New task test");
  });

  describe("Task operations", () => {
    test("Add new task", async () => {
      await useTasksStore.setState({
        tasks: [mockedTaskDataDefault[0]],
      });

      expect(useTasksStore.getState().tasks).toStrictEqual([
        mockedTaskDataDefault[0],
      ]);

      await useTasksStore.getState().addNewTask(mockedTaskDataDefault[1]);

      expect(useTasksStore.getState().tasks).toStrictEqual(
        mockedTaskDataDefault,
      );
    });

    test("Update task", async () => {
      await useTasksStore.setState({
        tasks: [mockedTaskDataDefault[0]],
      });

      expect(useTasksStore.getState().tasks).toStrictEqual([
        mockedTaskDataDefault[0],
      ]);

      const updatedTask = {
        ...mockedTaskDataDefault[0],
        title: "Test task updated",
      };

      await useTasksStore.getState().updateTask(updatedTask);

      expect(useTasksStore.getState().tasks).toStrictEqual([updatedTask]);
    });

    test("Remove task", async () => {
      await useTasksStore.setState({
        tasks: mockedTaskDataDefault,
      });

      expect(useTasksStore.getState().tasks).toStrictEqual(
        mockedTaskDataDefault,
      );

      await useTasksStore.getState().removeTask(mockedTaskDataDefault[1].id);

      expect(useTasksStore.getState().tasks).toStrictEqual([
        mockedTaskDataDefault[0],
      ]);
    });
  });

  describe("Task Schedule", () => {
    test("Set schedule", () => {
      expect(useTasksStore.getState().schedule).toBe(undefined);

      const newSchedule = dayjs().format();

      useTasksStore.getState().setSchedule(newSchedule);

      expect(useTasksStore.getState().schedule).toBe(newSchedule);
    });
  });

  describe("Revert completed", () => {
    test("Revert for DEFAULT task", async () => {
      await useTasksStore.setState({
        tasks: [
          {
            ...mockedTaskDataDefault[0],
            status: StatusTypes.COMPLETED,
          },
        ],
      });
      expect(useTasksStore.getState().tasks[0].status).toBe(
        StatusTypes.COMPLETED,
      );

      await useTasksStore
        .getState()
        .revertCompleted(mockedTaskDataDefault[0].id);

      expect(useTasksStore.getState().tasks[0].status).toBe(StatusTypes.ACTIVE);
    });

    test("Revert RECURRING only for one week", async () => {
      const lastWeek = dayjs().subtract(1, "week").format();
      await useTasksStore.setState({
        tasks: [
          {
            ...mockedTaskDataDefault[0],
            type: TasksTypes.RECURRING,
            repeatCompletedForWeeks: [lastWeek],
            status: StatusTypes.ACTIVE,
          },
        ],
      });
      expect(useTasksStore.getState().tasks[0].status).toBe(StatusTypes.ACTIVE);
      expect(
        useTasksStore.getState().tasks[0].repeatCompletedForWeeks,
      ).toStrictEqual([lastWeek]);

      await useTasksStore
        .getState()
        .revertCompleted(mockedTaskDataDefault[0].id, true);

      expect(useTasksStore.getState().tasks[0].status).toBe(StatusTypes.ACTIVE);
      expect(
        useTasksStore.getState().tasks[0].repeatCompletedForWeeks,
      ).toStrictEqual([]);
    });

    test("Revert SCHEDULED RECURRING only for one week", async () => {
      const lastWeek = dayjs().subtract(1, "week").format();
      await useTasksStore.setState({
        tasks: [
          {
            ...mockedTaskDataDefault[0],
            type: TasksTypes.SCHEDULED_RECURRING,
            repeatCompletedForWeeks: [lastWeek],
            status: StatusTypes.ACTIVE,
          },
        ],
      });
      expect(useTasksStore.getState().tasks[0].status).toBe(StatusTypes.ACTIVE);
      expect(
        useTasksStore.getState().tasks[0].repeatCompletedForWeeks,
      ).toStrictEqual([lastWeek]);

      await useTasksStore
        .getState()
        .revertCompleted(mockedTaskDataDefault[0].id, true);

      expect(useTasksStore.getState().tasks[0].status).toBe(StatusTypes.ACTIVE);
      expect(
        useTasksStore.getState().tasks[0].repeatCompletedForWeeks,
      ).toStrictEqual([]);
    });
  });

  describe("Selectors", () => {
    describe("Default selectors", () => {
      test("defaultTasksSelector", async () => {
        const day = dayjs().day(0).format();
        const nextDay = dayjs().day(1).format();
        const tasks = [
          {
            ...mockedTaskDataDefault[1],
            assigned: nextDay,
          },
          {
            ...mockedTaskDataDefault[0],
            assigned: day,
          },
        ];

        await useTasksStore.setState({
          tasks,
        });

        expect(useTasksStore.getState().tasks).toStrictEqual(tasks);

        const results = await useTasksStore.getState().defaultTasksSelector();

        expect(results).toStrictEqual(tasks.reverse());
      });
    });

    describe("Completed", () => {
      test("defaultCompletedTasks", async () => {
        const day = dayjs().day(0).format();
        const nextDay = dayjs().day(1).format();
        const tasks = [
          {
            ...mockedTaskDataDefault[1],
            assigned: nextDay,
            status: StatusTypes.COMPLETED,
          },
          {
            ...mockedTaskDataDefault[0],
            assigned: day,
            status: StatusTypes.COMPLETED,
          },
        ];

        await useTasksStore.setState({
          tasks,
        });

        expect(useTasksStore.getState().tasks).toStrictEqual(tasks);

        const results = await useTasksStore.getState().defaultCompletedTasks();

        expect(results).toStrictEqual(tasks.reverse());
      });

      test("allCompletedTasks", async () => {
        const day = dayjs().day(0).format();
        const nextDay = dayjs().day(1).format();
        const tasks = [
          {
            ...mockedTaskDataDefault[1],
            assigned: nextDay,
            status: StatusTypes.COMPLETED,
          },
          {
            ...mockedTaskDataDefault[0],
            assigned: day,
            status: StatusTypes.COMPLETED,
          },
        ];

        await useTasksStore.setState({
          tasks,
        });

        expect(useTasksStore.getState().tasks).toStrictEqual(tasks);

        const results = await useTasksStore.getState().allCompletedTasks();

        expect(results).toStrictEqual(tasks.reverse());
      });
    });
  });
});
