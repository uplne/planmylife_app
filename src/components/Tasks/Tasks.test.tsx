import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import dayjs from 'dayjs';

import { Tasks } from './';
import { useTasksStore, TasksStoreDefault, TaskType } from '../../store/Tasks';
import { StatusTypes, TasksTypes } from '../../types/status';
import { useWeekStore, WeekDefault } from '../../store/Week';
import { useModalStore, ModalStoreDefault } from '../../store/Modal';

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockedTaskData:TaskType[] = [
  {
    id: 'id1',
    type: TasksTypes.DEFAULT,
    status: StatusTypes.ACTIVE,
    title: 'Test task 1',
    created: null,
    createdTimestamp: null,
    updated: null,
    assigned: null,
    assignedTimestamp: null,
    completed: null,
    moved: [],
    schedule: dayjs().format(),
    repeatCompletedForWeeks: [] ,
  }
]

describe("Tasks", () => {
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

    // jest.mock('@tanstack/react-query', () => ({
    //   useQuery: jest.fn().mockReturnValue(({ data: mockedTaskData, status: 'success', error:{} }))
    //  }));
  });

  test('Render loader', async () => {
    render(<Tasks />, { wrapper });
    await waitFor(() => expect(screen.getByTestId('preloader')).toBeInTheDocument());
  });

  test('Fetch task data', async () => {
    render(<Tasks />, { wrapper });
    await waitFor(() => expect(screen.getByTestId('preloader')).toBeInTheDocument());
  });

  test('renders tasks', () => {
    render(<Tasks />, { wrapper });
    const tasksTitle = screen.getByText(/Tasks/i);
  
    expect(tasksTitle).toBeInTheDocument();
  });
})
