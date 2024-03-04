import dayjs from "dayjs";
import { collection, getDocs, where } from "firebase/firestore";

import { useAuthStore, AuthDefault } from "../../store/Auth";
import { useWeekStore, WeekDefault } from "../../store/Week";
import { useConfirmStore } from "../../store/Confirm";
import { useTasksStore, TasksStoreDefault, TaskType } from "../../store/Tasks";
import {
  useTaskSchedulerStore,
  TaskSchedulerStoreDefault,
  SchedulerType,
  SchedulerPeriod,
} from "../../store/TaskScheduler";
import * as Controller from "./tasks.controller";
import { useModalStore } from "../../store/Modal";
import { DATA_FETCHING_STATUS } from "../../types/status";
import { StatusTypes, TasksTypes } from "../../types/status";
import { removeTaskAPI, saveTaskAPI, updateTaskAPI } from "./tasks.service";
import { showSuccessNotification } from "../Notification/controller";
import { NOTIFICATION_TYPE } from "../../store/Notification";
import { TasksAPITypes } from "../../store/Tasks/api";

const TASKS_MOCK: TaskType[] = [
  {
    id: "1",
    userId: "111",
    type: TasksTypes.DEFAULT,
    status: StatusTypes.ACTIVE,
    title: "Task one",
    created: null,
    createdTimestamp: null,
    updated: null,
    assigned: null,
    assignedTimestamp: null,
    completed: null,
    moved: [],
    schedule: null,
    repeatCompletedForWeeks: [],
  },
  {
    id: "2",
    userId: "111",
    type: TasksTypes.DEFAULT,
    status: StatusTypes.ACTIVE,
    title: "Task two",
    created: null,
    createdTimestamp: null,
    updated: null,
    assigned: null,
    assignedTimestamp: null,
    completed: null,
    moved: [],
    schedule: null,
    repeatCompletedForWeeks: [],
  },
];

jest.mock("../../store/Auth");
jest.mock("../../store/Week");
jest.mock("../../store/Tasks");
jest.mock("./tasks.service", () => ({
  removeTaskAPI: jest.fn(),
  saveTaskAPI: jest.fn(),
  updateTaskAPI: jest.fn(),
}));

jest.mock("../Notification/controller", () => ({
  showSuccessNotification: jest.fn(),
}));

jest.mock("firebase/firestore", () => {
  const actualTracker = jest.requireActual("firebase/firestore");

  return {
    ...actualTracker,
    collection: jest.fn(),
    where: jest.fn(),
    query: jest.fn(),
    getDocs: jest.fn(),
  };
});
jest.mock("../../services/firebase", () => {
  const actualTracker = jest.requireActual("firebase/firestore");
  return {
    ...actualTracker,
    db: "firestore",
  };
});

let selectedWeek = dayjs().format();

const mockTasksStore = {
  ...TasksStoreDefault,
  fillTasks: jest.fn(),
  updateIsLoading: jest.fn(),
  updateNewTask: jest.fn(),
  setSchedule: jest.fn(),
  addNewTask: jest.fn(),
  updateTask: jest.fn(),
  revertCompleted: jest.fn(),
  removeTask: jest.fn(),

  defaultTasksSelector: jest.fn(),
  defaultCompletedTasks: jest.fn(),
  allCompletedTasks: jest.fn(),
};

const mockTaskSchedulerStore = {
  ...TaskSchedulerStoreDefault,
  setRepeatType: jest.fn(),
  setRepeatPeriod: jest.fn(),
  setRepeatTimes: jest.fn(),
  resetScheduler: jest.fn(),
};

describe("Tasks controller", () => {
  beforeEach(() => {
    const mockAuthStore = {
      ...AuthDefault,
      currentUser: {
        ...AuthDefault.currentUser,
        id: "123-123",
      },
    };
    useAuthStore.getState = () => mockAuthStore as any;

    const mockWeekStore = {
      ...WeekDefault,
      selectedWeek,
    };
    useWeekStore.getState = () => mockWeekStore;

    useTasksStore.getState = () => mockTasksStore;

    useTaskSchedulerStore.getState = () => mockTaskSchedulerStore;
  });

  describe("Fetching data", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("it should fetch data from firebase", async () => {
      (getDocs as jest.Mock).mockReturnValue(
        Promise.resolve(
          TASKS_MOCK.map((item) => ({
            data: () => ({
              ...item,
            }),
          })),
        ),
      );

      expect(useAuthStore.getState().currentUser!.id).toBe("123-123");
      expect(useWeekStore.getState().selectedWeek).toBe(selectedWeek);
      expect(useTasksStore.getState().isLoading).toBe(
        DATA_FETCHING_STATUS.NODATA,
      );

      const dataFetchingResult = await Controller.fetchDefaultData();

      expect(collection).toHaveBeenCalled();
      expect(collection).toHaveBeenCalledWith(
        "firestore",
        "tasks/123-123/default",
      );
      expect(where).toHaveBeenNthCalledWith(
        1,
        "assignedTimestamp",
        ">=",
        new Date(dayjs(selectedWeek).startOf("week").format()),
      );
      expect(where).toHaveBeenNthCalledWith(
        2,
        "assignedTimestamp",
        "<",
        new Date(dayjs(selectedWeek).endOf("week").format()),
      );

      expect(useTasksStore.getState().fillTasks).toHaveBeenCalledWith(
        TASKS_MOCK,
      );
      expect(dataFetchingResult).toBe(DATA_FETCHING_STATUS.LOADED);
      expect(useTasksStore.getState().updateIsLoading).toHaveBeenCalledTimes(2);
      expect(useTasksStore.getState().updateIsLoading).toHaveBeenNthCalledWith(
        1,
        DATA_FETCHING_STATUS.FETCHING,
      );
      expect(useTasksStore.getState().updateIsLoading).toHaveBeenNthCalledWith(
        2,
        DATA_FETCHING_STATUS.LOADED,
      );
    });

    test("it failed to fetch data", async () => {
      (getDocs as jest.Mock).mockReturnValue(Promise.reject("Some error"));

      const dataFetchingResult = await Controller.fetchDefaultData();

      expect(dataFetchingResult).toBe(DATA_FETCHING_STATUS.ERROR);
      expect(useTasksStore.getState().updateIsLoading).toHaveBeenCalledTimes(2);
      expect(useTasksStore.getState().updateIsLoading).toHaveBeenNthCalledWith(
        1,
        DATA_FETCHING_STATUS.FETCHING,
      );
      expect(useTasksStore.getState().updateIsLoading).toHaveBeenNthCalledWith(
        2,
        DATA_FETCHING_STATUS.ERROR,
      );
    });
  });

  describe("Creating task", () => {
    beforeEach(() => {
      jest.restoreAllMocks();
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
      jest.clearAllMocks();
    });

    test("Should save new task - DEFAULT", async () => {
      jest.spyOn(Controller, "saveTask").mockReturnValue(Promise.resolve());

      const mockedTask = {
        ...mockTasksStore,
        newTask: "New Task",
      };

      useTasksStore.getState = () => mockedTask;

      await Controller.saveNewTask();

      expect(useTasksStore.getState().newTask).toBe("New Task");
      expect(Controller.saveTask).toHaveBeenCalledTimes(1);
      expect(Controller.saveTask).toHaveBeenCalledWith({
        id: StatusTypes.NEW,
        userId: "123-123",
        type: TasksTypes.DEFAULT,
        assigned: dayjs(selectedWeek).format(),
        title: "New Task",
        status: StatusTypes.NEW,
        created: null,
        createdTimestamp: null,
        updated: null,
        assignedTimestamp: null,
        completed: null,
        moved: [],
        schedule: null,
        repeatCompletedForWeeks: [],
      });
    });

    test("Should save new task - SCHEDULED", async () => {
      jest.spyOn(Controller, "saveTask").mockReturnValue(Promise.resolve());

      const schedule = dayjs().format();
      const mockedTask = {
        ...mockTasksStore,
        newTask: "New Task",
        schedule,
      };

      useTasksStore.getState = () => mockedTask;

      await Controller.saveNewTask();

      expect(useTasksStore.getState().newTask).toBe("New Task");
      expect(Controller.saveTask).toHaveBeenCalledWith({
        id: StatusTypes.NEW,
        userId: "123-123",
        type: TasksTypes.SCHEDULE,
        assigned: schedule,
        title: "New Task",
        status: StatusTypes.NEW,
        created: null,
        createdTimestamp: null,
        updated: null,
        assignedTimestamp: null,
        completed: null,
        moved: [],
        schedule: null,
        repeatCompletedForWeeks: [],
      });
    });

    test("saveTask - empty - new", () => {
      const task: TaskType = {
        id: StatusTypes.NEW,
        userId: "111",
        type: TasksTypes.SCHEDULE,
        assigned: dayjs().format(),
        title: "",
        status: StatusTypes.NEW,
        created: null,
        createdTimestamp: null,
        updated: null,
        assignedTimestamp: null,
        completed: null,
        moved: [],
        schedule: null,
        repeatCompletedForWeeks: [],
      };

      jest.spyOn(useModalStore.getState(), "resetModal");

      Controller.saveTask(task);
      expect(useModalStore.getState().resetModal).not.toHaveBeenCalled();
    });

    test("saveTask - not empty - udpate", async () => {
      const task: TaskType = {
        id: StatusTypes.NEW,
        userId: "111",
        type: TasksTypes.SCHEDULE,
        assigned: dayjs().format(),
        title: "New task",
        status: StatusTypes.NEW,
        created: null,
        createdTimestamp: null,
        updated: null,
        assignedTimestamp: null,
        completed: null,
        moved: [],
        schedule: null,
        repeatCompletedForWeeks: [],
      };

      jest.spyOn(useModalStore.getState(), "resetModal");
      jest.spyOn(Controller, "updateTask").mockResolvedValue(Promise.resolve());

      await Controller.saveTask(task);
      expect(useModalStore.getState().resetModal).toHaveBeenCalled();
      expect(Controller.updateTask).toHaveBeenCalled();
      expect(Controller.updateTask).toHaveBeenCalledWith(task);
    });

    test("saveTask - empty - not new - should trigger delete confirmation", async () => {
      const task: TaskType = {
        id: StatusTypes.ACTIVE,
        userId: "111",
        type: TasksTypes.SCHEDULE,
        assigned: dayjs().format(),
        title: "",
        status: StatusTypes.NEW,
        created: null,
        createdTimestamp: null,
        updated: null,
        assignedTimestamp: null,
        completed: null,
        moved: [],
        schedule: null,
        repeatCompletedForWeeks: [],
      };

      jest.spyOn(useModalStore.getState(), "resetModal");
      jest.spyOn(useConfirmStore.getState(), "openConfirm");
      jest.spyOn(Controller, "updateTask").mockResolvedValue(Promise.resolve());

      await Controller.saveTask(task);
      expect(useModalStore.getState().resetModal).toHaveBeenCalled();
      expect(useConfirmStore.getState().openConfirm).toHaveBeenCalled();
      expect(Controller.updateTask).not.toHaveBeenCalled();
    });
  });

  describe("Remove task", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("Should remove task - removeTask", async () => {
      jest.spyOn(useTasksStore.getState(), "removeTask");

      await Controller.removeTask("1");
      expect(removeTaskAPI).toHaveBeenCalledWith("1");
      expect(useTasksStore.getState().removeTask).toHaveBeenCalledWith("1");
      expect(showSuccessNotification).toHaveBeenCalledWith({
        message: "Task removed",
        type: NOTIFICATION_TYPE.SUCCESS,
      });
    });

    test("Should remove task - removeTask - FAIL", async () => {
      jest.spyOn(useTasksStore.getState(), "removeTask");

      (removeTaskAPI as jest.Mock).mockImplementation(() => {
        throw new Error("Error");
      });

      await Controller.removeTask("1");
      expect(useTasksStore.getState().removeTask).not.toHaveBeenCalled();
      expect(showSuccessNotification).toHaveBeenCalledWith({
        message: "Task removing failed. Error: Error",
        type: NOTIFICATION_TYPE.FAIL,
      });
    });
  });

  describe("Update task", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    test("updateTask - NEW", async () => {
      const task: TaskType = {
        id: StatusTypes.NEW,
        userId: "111",
        type: TasksTypes.DEFAULT,
        assigned: null,
        title: "New Task",
        status: StatusTypes.NEW,
        created: null,
        createdTimestamp: null,
        updated: null,
        assignedTimestamp: null,
        completed: null,
        moved: [],
        schedule: null,
        repeatCompletedForWeeks: [],
      };

      jest.spyOn(useTasksStore.getState(), "updateTask");
      jest.spyOn(Controller, "createNewTask").mockResolvedValueOnce();

      await Controller.updateTask(task);

      expect(Controller.createNewTask).toHaveBeenCalled();
      expect(useTasksStore.getState().updateTask).not.toHaveBeenCalled();
      expect(saveTaskAPI).not.toHaveBeenCalled();
      expect(showSuccessNotification).toHaveBeenCalledWith({
        message: "Task saved",
        type: NOTIFICATION_TYPE.SUCCESS,
      });
    });

    test("updateTask - UPDATE", async () => {
      const task: TaskType = {
        id: "123",
        userId: "111",
        type: TasksTypes.DEFAULT,
        assigned: null,
        title: "Update Task",
        status: StatusTypes.NEW,
        created: null,
        createdTimestamp: null,
        updated: null,
        assignedTimestamp: null,
        completed: null,
        moved: [],
        schedule: null,
        repeatCompletedForWeeks: [],
      };

      jest.spyOn(useTasksStore.getState(), "updateTask");

      await Controller.updateTask(task);

      expect(useTasksStore.getState().updateTask).toHaveBeenCalledWith(task);
      expect(saveTaskAPI).toHaveBeenCalledWith(task.id);
      expect(showSuccessNotification).toHaveBeenCalledWith({
        message: "Task saved",
        type: NOTIFICATION_TYPE.SUCCESS,
      });
    });
  });

  describe("Create new task", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
      jest.restoreAllMocks();
      jest.useFakeTimers().setSystemTime(new Date("2023-01-10"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("Create with current week", async () => {
      const task: TaskType = {
        id: StatusTypes.NEW,
        userId: "111",
        type: TasksTypes.DEFAULT,
        assigned: null,
        title: "New Task",
        status: StatusTypes.ACTIVE,
        created: null,
        createdTimestamp: null,
        updated: null,
        assignedTimestamp: null,
        completed: null,
        moved: [],
        schedule: null,
        repeatCompletedForWeeks: [],
      };

      jest.spyOn(useTasksStore.getState(), "addNewTask");
      jest.spyOn(useModalStore.getState(), "resetModal");

      await Controller.createNewTask(task);

      expect(useTasksStore.getState().addNewTask).toHaveBeenCalledWith({
        ...task,
        created: dayjs().format(),
        assignedTimestamp: dayjs().format(),
        createdTimestamp: dayjs().format(),
      });
      expect(saveTaskAPI).toHaveBeenCalled();
      expect(useModalStore.getState().resetModal).toHaveBeenCalled();
    });

    test("Create with assigned week", async () => {
      const task: TaskType = {
        id: StatusTypes.NEW,
        userId: "111",
        type: TasksTypes.DEFAULT,
        assigned: dayjs().format(),
        title: "New Task",
        status: StatusTypes.ACTIVE,
        created: null,
        createdTimestamp: null,
        updated: null,
        assignedTimestamp: null,
        completed: null,
        moved: [],
        schedule: null,
        repeatCompletedForWeeks: [],
      };

      jest.spyOn(useTasksStore.getState(), "addNewTask");
      jest.spyOn(useModalStore.getState(), "resetModal");

      await Controller.createNewTask(task);

      expect(useTasksStore.getState().addNewTask).toHaveBeenCalledWith({
        ...task,
        created: dayjs().format(),
        assignedTimestamp: dayjs().format(),
        createdTimestamp: dayjs().format(),
      });
      expect(saveTaskAPI).toHaveBeenCalled();
      expect(useModalStore.getState().resetModal).toHaveBeenCalled();
    });
  });

  describe("findTaskById", () => {
    test("it should work", async () => {
      useTasksStore.getState = () => ({
        ...mockTasksStore,
        tasks: TASKS_MOCK,
      });
      const result = await Controller.findTaskById("2");

      expect(result).toBe(TASKS_MOCK[1]);
    });
  });

  describe("Complete task", () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date("2023-01-10"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("it should complete the DEFAULT task", async () => {
      useTasksStore.getState = () => ({
        ...mockTasksStore,
        tasks: [...TASKS_MOCK],
      });
      jest.spyOn(useTasksStore.getState(), "updateTask");

      const result = await Controller.completeTask("2");

      expect(useTasksStore.getState().updateTask).toHaveBeenCalledWith(
        TASKS_MOCK[1],
      );
      expect(updateTaskAPI).toHaveBeenCalledWith(TASKS_MOCK[1]);
      expect(showSuccessNotification).toHaveBeenCalledWith({
        message: "Task completed",
        type: NOTIFICATION_TYPE.SUCCESS,
      });
      expect(result).toBe(TASKS_MOCK[1]);
    });

    test("it should complete the RECURRING task - with recurringComplete flag", async () => {
      jest.useFakeTimers().setSystemTime(new Date("2023-01-10"));
      TASKS_MOCK[0].type = TasksTypes.RECURRING;
      useTasksStore.getState = () => ({
        ...mockTasksStore,
        tasks: [
          {
            ...TASKS_MOCK[0],
            repeatCompletedForWeeks: [],
          },
        ],
      });
      useWeekStore.getState = () => ({
        ...WeekDefault,
        today: dayjs().format(),
      });
      const FINAL_TASK = {
        ...TASKS_MOCK[0],
        status: StatusTypes.COMPLETED,
        completed: dayjs().format(),
        repeatCompletedForWeeks: [selectedWeek],
      };
      jest.spyOn(useTasksStore.getState(), "updateTask");

      const result = await Controller.completeTask("1", true);

      expect(useTasksStore.getState().updateTask).toHaveBeenCalledWith(
        FINAL_TASK,
      );
      expect(updateTaskAPI).toHaveBeenCalledWith(FINAL_TASK);
      expect(showSuccessNotification).toHaveBeenCalledWith({
        message: "Task completed",
        type: NOTIFICATION_TYPE.SUCCESS,
      });

      expect(result).toStrictEqual(FINAL_TASK);
      jest.useRealTimers();
    });

    test("it should complete the SCHEDULED RECURRING task - with recurringComplete flag", async () => {
      TASKS_MOCK[0].type = TasksTypes.SCHEDULED_RECURRING;
      useTasksStore.getState = () => ({
        ...mockTasksStore,
        tasks: [
          {
            ...TASKS_MOCK[0],
            repeatCompletedForWeeks: [],
          },
        ],
      });
      useWeekStore.getState = () => ({
        ...WeekDefault,
        today: dayjs().format(),
      });
      const FINAL_TASK = {
        ...TASKS_MOCK[0],
        status: StatusTypes.COMPLETED,
        completed: "2023-01-10T00:00:00+00:00",
        repeatCompletedForWeeks: [selectedWeek],
      };
      jest.useFakeTimers().setSystemTime(new Date("2023-01-10"));
      jest.spyOn(useTasksStore.getState(), "updateTask");

      const result = await Controller.completeTask("1", true);

      expect(useTasksStore.getState().updateTask).toHaveBeenCalledWith(
        FINAL_TASK,
      );
      expect(updateTaskAPI).toHaveBeenCalledWith(FINAL_TASK);
      expect(showSuccessNotification).toHaveBeenCalledWith({
        message: "Task completed",
        type: NOTIFICATION_TYPE.SUCCESS,
      });

      expect(result).toStrictEqual(FINAL_TASK);
      jest.useRealTimers();
    });

    test("it should complete the RECURRING task - without recurringComplete flag", async () => {
      TASKS_MOCK[0].type = TasksTypes.RECURRING;
      useTasksStore.getState = () => ({
        ...mockTasksStore,
        tasks: [
          {
            ...TASKS_MOCK[0],
            repeatCompletedForWeeks: [],
          },
        ],
      });
      useWeekStore.getState = () => ({
        ...WeekDefault,
        today: dayjs().format(),
      });
      const FINAL_TASK = {
        ...TASKS_MOCK[0],
        completed: null,
        repeatCompletedForWeeks: [selectedWeek],
      };
      jest.spyOn(useTasksStore.getState(), "updateTask");

      const result = await Controller.completeTask("1");

      expect(useTasksStore.getState().updateTask).toHaveBeenCalledWith(
        FINAL_TASK,
      );
      expect(updateTaskAPI).toHaveBeenCalledWith(FINAL_TASK);
      expect(showSuccessNotification).toHaveBeenCalledWith({
        message: "Task completed",
        type: NOTIFICATION_TYPE.SUCCESS,
      });

      expect(result).toStrictEqual(FINAL_TASK);
    });

    test("it should complete the SCHEDULED RECURRING task - without recurringComplete flag", async () => {
      TASKS_MOCK[0].type = TasksTypes.SCHEDULED_RECURRING;
      useTasksStore.getState = () => ({
        ...mockTasksStore,
        tasks: [
          {
            ...TASKS_MOCK[0],
            repeatCompletedForWeeks: [],
          },
        ],
      });
      useWeekStore.getState = () => ({
        ...WeekDefault,
        today: dayjs().format(),
      });
      const FINAL_TASK = {
        ...TASKS_MOCK[0],
        completed: null,
        repeatCompletedForWeeks: [selectedWeek],
      };
      jest.useFakeTimers().setSystemTime(new Date("2023-01-10"));
      jest.spyOn(useTasksStore.getState(), "updateTask");

      const result = await Controller.completeTask("1");

      expect(useTasksStore.getState().updateTask).toHaveBeenCalledWith(
        FINAL_TASK,
      );
      expect(updateTaskAPI).toHaveBeenCalledWith(FINAL_TASK);
      expect(showSuccessNotification).toHaveBeenCalledWith({
        message: "Task completed",
        type: NOTIFICATION_TYPE.SUCCESS,
      });

      expect(result).toStrictEqual(FINAL_TASK);
      jest.useRealTimers();
    });
  });

  describe("Revert completed task", () => {
    test("it should revert the DEFAULT task", async () => {
      useTasksStore.getState = () => ({
        ...mockTasksStore,
        tasks: [
          {
            ...TASKS_MOCK[0],
            completed: "Some day",
            status: StatusTypes.COMPLETED,
          },
        ],
      });
      const FINAL_TASK = {
        ...TASKS_MOCK[0],
        completed: null,
      };
      jest.spyOn(useTasksStore.getState(), "updateTask");

      const result = await Controller.revertCompletedTask("1", false);

      expect(useTasksStore.getState().updateTask).toHaveBeenCalledWith(
        FINAL_TASK,
      );
      expect(updateTaskAPI).toHaveBeenCalledWith(FINAL_TASK);
      expect(showSuccessNotification).toHaveBeenCalledWith({
        message: "Task reverted to status: ACTIVE",
        type: NOTIFICATION_TYPE.SUCCESS,
      });
      expect(result).toStrictEqual(FINAL_TASK);
    });

    test("it should revert the RECURRING task - only one occurence", async () => {
      const MOCKED_TASK = {
        ...TASKS_MOCK[0],
        type: TasksTypes.RECURRING,
        status: StatusTypes.ACTIVE,
        repeatCompletedForWeeks: [dayjs().format()],
      };
      useTasksStore.getState = () => ({
        ...mockTasksStore,
        tasks: [MOCKED_TASK],
      });

      useWeekStore.getState = () =>
        ({
          selectedWeekId: dayjs().format("YYYY-MM-DD"),
        }) as any;

      const FINAL_TASK = {
        ...MOCKED_TASK,
        completed: null,
      };
      jest.spyOn(useTasksStore.getState(), "updateTask");

      const result = await Controller.revertCompletedTask("1", true);

      expect(useTasksStore.getState().updateTask).toHaveBeenCalledWith(
        FINAL_TASK,
      );
      expect(updateTaskAPI).toHaveBeenCalledWith(FINAL_TASK);
      expect(showSuccessNotification).toHaveBeenCalledWith({
        message: "Task reverted to status: ACTIVE",
        type: NOTIFICATION_TYPE.SUCCESS,
      });
      expect(result).toStrictEqual(FINAL_TASK);
    });
  });

  describe("Save edited task", () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date("2023-01-10"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("Save edited default task - only title", async () => {
      useTasksStore.getState = () => ({
        ...mockTasksStore,
        tasks: [...TASKS_MOCK],
        newTask: "New Task",
      });
      jest.spyOn(Controller, "saveTask").mockReturnValue(Promise.resolve());
      jest.spyOn(useTasksStore.getState(), "updateTask");
      jest.spyOn(useTasksStore.getState(), "updateNewTask");
      jest.spyOn(useModalStore.getState(), "resetModal");

      await Controller.saveEditedTask("1");

      expect(Controller.saveTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "New Task",
        }),
      );
      expect(useModalStore.getState().resetModal).toHaveBeenCalledTimes(1);
      expect(useTasksStore.getState().updateNewTask).toHaveBeenCalledWith("");
    });

    test("Save edited default task - title with schedule", async () => {
      useTasksStore.getState = () => ({
        ...mockTasksStore,
        tasks: [...TASKS_MOCK],
        newTask: "New Task",
        schedule: dayjs().format(),
      });
      jest.spyOn(Controller, "saveTask").mockReturnValue(Promise.resolve());
      jest.spyOn(useTasksStore.getState(), "updateTask");
      jest.spyOn(useTasksStore.getState(), "updateNewTask");
      jest.spyOn(useModalStore.getState(), "resetModal");

      await Controller.saveEditedTask("1");

      expect(Controller.saveTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "New Task",
          schedule: dayjs().format(),
          type: TasksTypes.SCHEDULE,
        }),
      );
      expect(useModalStore.getState().resetModal).toHaveBeenCalledTimes(1);
      expect(useTasksStore.getState().updateNewTask).toHaveBeenCalledWith("");
    });

    test("Save edited RECURRING task - schedule", async () => {
      const MOCKED_TASKS: TasksAPITypes[] = [
        {
          ...TASKS_MOCK[0],
          type: TasksTypes.RECURRING,
          schedule: dayjs().subtract(1, "day").format(),
        },
      ];
      useTasksStore.getState = () => ({
        ...mockTasksStore,
        tasks: [...MOCKED_TASKS],
        newTask: "New Task",
        schedule: dayjs().format(),
        type: TasksTypes.RECURRING,
      });

      jest.spyOn(Controller, "saveTask").mockReturnValue(Promise.resolve());
      jest.spyOn(Controller, "completeTask");
      jest.spyOn(useTasksStore.getState(), "updateTask");
      jest.spyOn(useTasksStore.getState(), "updateNewTask");
      jest.spyOn(useModalStore.getState(), "resetModal");

      await Controller.saveEditedTask("1");

      expect(Controller.completeTask).toHaveBeenCalledWith("1", true);
      expect(Controller.saveTask).toHaveBeenCalledWith({
        ...TASKS_MOCK[0],
        title: "New Task",
        id: StatusTypes.NEW,
        schedule: dayjs().format(),
        type: TasksTypes.SCHEDULE,
        repeatCompletedForWeeks: [],
      });
      expect(useModalStore.getState().resetModal).toHaveBeenCalledTimes(1);
      expect(useTasksStore.getState().updateNewTask).toHaveBeenCalledWith("");
    });

    test("Save edited RECURRING task - recurring changed", async () => {
      const MOCKED_TASKS: TasksAPITypes[] = [
        {
          ...TASKS_MOCK[0],
          type: TasksTypes.SCHEDULED_RECURRING,
          repeatType: SchedulerType.every,
          repeatTimes: 1,
          repeatPeriod: SchedulerPeriod.week,
          schedule: dayjs().subtract(1, "day").format(),
        },
      ];
      useTasksStore.getState = () => ({
        ...mockTasksStore,
        tasks: [...MOCKED_TASKS],
        newTask: "New Task",
        schedule: dayjs().format(),
      });
      useTaskSchedulerStore.getState = () => ({
        ...mockTaskSchedulerStore,
        repeatType: SchedulerType.every,
        repeatTimes: 1,
        repeatPeriod: SchedulerPeriod.month,
      });
      jest.spyOn(Controller, "saveTask").mockReturnValue(Promise.resolve());
      jest.spyOn(Controller, "completeTask");
      jest.spyOn(useTasksStore.getState(), "updateTask");
      jest.spyOn(useTasksStore.getState(), "updateNewTask");
      jest.spyOn(useModalStore.getState(), "resetModal");

      await Controller.saveEditedTask("1");

      expect(Controller.completeTask).toHaveBeenCalledWith("1", true);
      expect(Controller.saveTask).toHaveBeenCalledWith({
        ...MOCKED_TASKS[0],
        title: "New Task",
        id: StatusTypes.NEW,
        schedule: dayjs().format(),
        type: TasksTypes.SCHEDULED_RECURRING,
        repeatPeriod: SchedulerPeriod.month,
        status: StatusTypes.COMPLETED,
        repeatCompletedForWeeks: [],
      });
      expect(useModalStore.getState().resetModal).toHaveBeenCalledTimes(1);
      expect(useTasksStore.getState().updateNewTask).toHaveBeenCalledWith("");
    });
  });

  describe("Move to the next week", () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date("2023-01-10"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("Move to the next week - default - less than 3 times, no schedule", async () => {
      const MOCKED_TASKS: TasksAPITypes[] = [
        {
          ...TASKS_MOCK[0],
        },
      ];
      useTasksStore.getState = () => ({
        ...mockTasksStore,
        tasks: MOCKED_TASKS,
        assigned: dayjs().format(),
      });

      jest.spyOn(useTasksStore.getState(), "updateTask");

      await Controller.moveToNextWeek("1");

      expect(useTasksStore.getState().updateTask).toHaveBeenCalledWith({
        ...TASKS_MOCK[0],
        assigned: dayjs().add(7, "days").format(),
        moved: [dayjs().format()],
      });
    });

    test("Move to the next week - default - more than 3 times", async () => {
      const MOCKED_TASKS: TasksAPITypes[] = [
        {
          ...TASKS_MOCK[0],
          moved: [
            dayjs().subtract(3, "week").format(),
            dayjs().subtract(2, "week").format(),
            dayjs().subtract(1, "week").format(),
          ],
          assigned: dayjs().format(),
        },
      ];
      useTasksStore.getState = () => ({
        ...mockTasksStore,
        tasks: MOCKED_TASKS,
      });

      jest.spyOn(useTasksStore.getState(), "updateTask");
      jest.spyOn(useConfirmStore.getState(), "openConfirm");

      await Controller.moveToNextWeek("1");

      expect(useConfirmStore.getState().openConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          title:
            "You moved this task three times already! Would you like to remove it from weekly planning?",
          subtitle:
            "It's a good practise to split tasks that you are struggling to complete or remove them from your goals altogether.",
          confirmLabel: "Yes, remove",
          cancelLabel: "No, keep",
        }),
      );
    });

    test("Move to the next week - default - less than 3 times, schedule", async () => {
      const MOCKED_TASKS: TasksAPITypes[] = [
        {
          ...TASKS_MOCK[0],
          assigned: dayjs().format(),
          schedule: dayjs().add(1, "day").format(),
        },
      ];
      useTasksStore.getState = () => ({
        ...mockTasksStore,
        tasks: MOCKED_TASKS,
      });

      jest.spyOn(useTasksStore.getState(), "updateTask");

      await Controller.moveToNextWeek("1");

      expect(useTasksStore.getState().updateTask).toHaveBeenCalledWith({
        ...TASKS_MOCK[0],
        assigned: dayjs().format(),
        moved: [dayjs().add(1, "day").format()],
        schedule: dayjs().add(8, "day").format(),
      });
    });
  });
});
