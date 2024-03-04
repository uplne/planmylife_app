import axios from "axios";
import dayjs from "dayjs";

import { auth } from "../../services/firebase";
import { getTasks } from "./tasks.service";
import { useAuthStore, AuthDefault } from "../../store/Auth";
import { TasksTypes } from "../../types/status";

jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock("../../services/firebase", () => ({
  auth: {
    currentUser: {
      getIdToken: jest.fn(),
    },
  },
}));

describe("Tasks Service", () => {
  beforeEach(() => {
    (auth.currentUser?.getIdToken as jest.Mock).mockResolvedValueOnce(
      "token123",
    );
    const mockAuthStore = {
      ...AuthDefault,
      currentUser: {
        ...AuthDefault.currentUser,
        id: "123-123",
      },
    };
    useAuthStore.getState = () => mockAuthStore as any;
    jest.useFakeTimers().setSystemTime(new Date("2023-01-10"));
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  test("GET tasks - no task type passed", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [{ id: "111" }] });

    await getTasks(dayjs().format(), dayjs().add(1, "day").format());

    expect(axios.get).toHaveBeenCalledWith(
      `http://localhost:3001/api/v1/tasks/123-123/${TasksTypes.DEFAULT}/${dayjs().format()}/${dayjs().add(1, "day").format()}`,
    );
  });

  test("GET tasks - task type passed", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [{ id: "111" }] });

    await getTasks(
      dayjs().format(),
      dayjs().add(1, "day").format(),
      TasksTypes.RECURRING,
    );

    expect(axios.get).toHaveBeenCalledWith(
      `http://localhost:3001/api/v1/tasks/123-123/${TasksTypes.RECURRING}/${dayjs().format()}/${dayjs().add(1, "day").format()}`,
    );
  });
});
