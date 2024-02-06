import dayjs from "dayjs";
import { collection, getDocs, where } from "firebase/firestore";

import { useAuthStore, AuthDefault } from "../../store/Auth";
import { useWeekStore, WeekDefault } from "../../store/Week";
import { useTasksStore, TasksStoreDefault, TaskType } from "../../store/Tasks";
import {
  useTaskSchedulerStore,
  TaskSchedulerStoreDefault,
} from "../../store/TaskScheduler";
import { fetchDefaultData, saveNewTask, saveTask } from "./controller";
import { DATA_FETCHING_STATUS } from "../../types/status";
import { StatusTypes, TasksTypes } from "../../types/status";

const TASKS_MOCK: TaskType[] = [
  {
    id: "1",
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
jest.mock("./controller", () => {
  const actualTracker = jest.requireActual("./controller");
  return {
    ...actualTracker,
    saveTask: jest.fn(),
  };
});

const selectedWeek = dayjs().format();

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

xdescribe("Tasks controller", () => {
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
    afterAll(() => {
      jest.clearAllMocks();
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

      const dataFetchingResult = await fetchDefaultData();

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

      const dataFetchingResult = await fetchDefaultData();

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
    xtest("Should save new task - DEFAULT", async () => {
      useTasksStore.getState = () => ({
        ...mockTasksStore,
        newTask: "New Task",
      });

      (saveTask as jest.Mock).mockReturnValue("test");

      await saveNewTask();
      console.log("saveTask: ", saveTask);

      expect(useTasksStore.getState().newTask).toBe("New Task");
      expect(useTasksStore.getState().schedule).toBe(null);
      expect(saveTask).toHaveBeenCalledWith("");
    });
  });
});
