import { render, screen, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import dayjs from "dayjs";

import { Tasks } from "./";
import { useTasksStore, TasksStoreDefault } from "../../store/Tasks";
import {
  mockedTaskDataDefault,
  mockedTaskDataDefaultCompleted,
} from "../../store/Tasks/TasksStore.mock";
import { DATA_FETCHING_STATUS } from "../../types/status";
import { useWeekStore, WeekDefault } from "../../store/Week";
import { useModalStore, ModalStoreDefault } from "../../store/Modal";
import { useFetchData } from "./index";

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

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

jest.mock("./tasks.controller", () => {
  const actualTracker = jest.requireActual("./tasks.controller");
  return {
    ...actualTracker,
    fetchDefaultData: () => Promise.resolve(mockedTaskDataDefault),
  };
});

xdescribe("Tasks", () => {
  beforeEach(() => {
    useTasksStore.setState({
      ...TasksStoreDefault,
    });
    useWeekStore.setState({
      ...WeekDefault,
    });
    useModalStore.setState({
      ...ModalStoreDefault,
    });
  });

  test("Fetch data", async () => {
    const { result } = renderHook(
      () => useFetchData({ selectedWeek: dayjs().format() }),
      { wrapper },
    );

    await waitFor(() =>
      expect(result.current.data).toStrictEqual(mockedTaskDataDefault),
    );
  });

  describe("Initial loading", () => {
    test("Render subheader with Tasks", async () => {
      render(<Tasks />, { wrapper });

      expect(await screen.findByText("Tasks")).toBeInTheDocument();
    });

    test("Add task button is not loaded by default", async () => {
      render(<Tasks />, { wrapper });

      expect(await screen.queryByText("Add task")).not.toBeInTheDocument();
    });

    test("Render loader", async () => {
      render(<Tasks />, { wrapper });
      await waitFor(() =>
        expect(screen.getByTestId("preloader")).toBeInTheDocument(),
      );
    });
  });

  describe("After task loaded", () => {
    beforeEach(() => {
      useTasksStore.setState({
        ...TasksStoreDefault,
        tasks: [...mockedTaskDataDefault, ...mockedTaskDataDefaultCompleted],
        isLoading: DATA_FETCHING_STATUS.LOADED,
      });
    });

    test("Render subheader with Tasks", async () => {
      render(<Tasks />, { wrapper });

      expect(await screen.findByText("Tasks")).toBeInTheDocument();
    });

    test("Add task button is loaded", async () => {
      render(<Tasks />, { wrapper });

      await waitFor(() =>
        expect(screen.queryByText("Add task")).toBeInTheDocument(),
      );
    });

    test("Show - This week", async () => {
      render(<Tasks />, { wrapper });

      await waitFor(() =>
        expect(screen.queryByText("This week")).toBeInTheDocument(),
      );
    });

    test("Show - Completed", async () => {
      render(<Tasks />, { wrapper });

      await waitFor(() =>
        expect(screen.queryByText("Completed")).toBeInTheDocument(),
      );
    });
  });

  // xtest('renders tasks', () => {
  //   render(<Tasks />, { wrapper });
  //   const tasksTitle = screen.getByText(/Tasks/i);

  //   expect(tasksTitle).toBeInTheDocument();
  // });
});
