import { useEffect } from 'react';
import {
  useQuery,
} from '@tanstack/react-query';

import { Box } from '../Box';
import { SubHeading } from '../SubHeading';
import { TasksBox } from '../TasksBox';
import { Preloader } from '../Preloader';
import { PlusIcon } from '../../components/Icons/PlusIcon';
import { BasicButton } from '../../components/Buttons/BasicButton';
import { AddTask } from './TaskModal/AddTask';

import { useTasksStore } from '../../store/Tasks';
import { useWeekStore } from '../../store/Week';
import { useModalStore } from '../../store/Modal';
import { fetchDefaultData, saveNewTask } from './controller';
import { LOADING } from '../../types/status';

import './Tasks.css';

export const Tasks = () => {
  const {
    tasks,
    isLoading,
    updateIsLoading,
  } = useTasksStore();
  const {
    selectedWeek,
  } = useWeekStore();
  const {
    toggleModal,
  } = useModalStore();
  const { data } = useQuery({
    queryKey: ['tasks', selectedWeek],
    queryFn: fetchDefaultData,
  });
  const loading = isLoading !== LOADING.LOADED;

  useEffect(() => {
    if (data === 'success') {
      updateIsLoading(LOADING.LOADED);
    }
  }, [data]);

  console.log(tasks);

  const addTaskSave = async () => {
    await saveNewTask();
  };

  const openModal = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    await toggleModal({
      isOpen: true,
      content: <AddTask />,
      title: 'Add Task',
      onSave: addTaskSave,
      disableAutoClose: true,
    });
  };

  return (
    <TasksBox>
      <Box>
        <SubHeading title="Tasks" />
        {loading && <Preloader small />}
        {!loading &&
          <>
            <div className="tasks__wrapper">
              <BasicButton
                onClick={openModal}
                withIcon
              ><PlusIcon />Add task</BasicButton>
            </div>
          </>
        }
      </Box>
    </TasksBox>
  );
};