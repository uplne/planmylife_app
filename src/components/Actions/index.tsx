import { Menu, Dropdown } from 'antd';

import { TasksTypes, StatusTypes } from '../../types/status';
import { TaskType, useTasksStore } from '../../store/Tasks/index';
import { revertCompletedTask, saveTask } from '../Tasks/controller';
import { useModalStore } from '../../store/Modal';
import { IconButton } from '../../components/Buttons/IconButton';
import {
  CheckIcon,
  BinIcon,
  ArrowCircleRight,
  DotsIcon,
  CheckEmptyIcon,
  PencilIcon,
  StopIcon,
  FolderDownloadIcon,
} from '../../components/Icons';
import { AddTask } from '../Tasks/TaskModal/AddTask';
import { completeTask as completeTaskAction } from '../Tasks/controller';

import { useWeekStore } from '../../store/Week';

import './Actions.css';

type ComponentTypes =  {
  task: TaskType,
};

export const Actions = ({
  task,
}: ComponentTypes) => {
  const selectedWeekId = useWeekStore().selectedWeekId;
  const {
    toggleModal,
  } = useModalStore();

  const completeTask = () => {
    completeTaskAction(task.id);
  };

  const removeTask = async () => {
    await saveTask({
      ...task,
      title: '',
    });
  };

  const moveToNextWeek = () => {
    // dispatch({
    //   type: 'tasks/moveTaskToNextWeek',
    //   payload: {
    //     id,
    //   },
    // });
  };

  const unCheck = async () => {
    await revertCompletedTask(task.id, false);
  };

  const editTaskHandler = async (e: React.MouseEvent<HTMLElement>) => {
    await toggleModal({
      isOpen: true,
      content: <AddTask task={task} editMode />,
      title: 'Edit Task',
      onSave: () => {},
      disableAutoClose: true,
    });

    // dispatch({
    //   type: 'modal/toggleModal',
    //   payload: {
    //     isOpen: true,
    //     content: <AddTask task={raw} editMode />,
    //     title: 'Edit Task',
    //     disableAutoClose: true,
    //     onSave: () => dispatch({
    //       type: 'tasks/saveEditedTask',
    //       payload: raw,
    //     }),
    //   },
    // });
  };

  const removeRecurringFromThisWeek = () => {};//dispatch({ type: 'tasks/removeRecurringFromWeek', payload: id });
  const completeRecurring = () => {}; //dispatch({ type: 'tasks/completeRecurring', payload: id });
  const unCheckRecurring = () => {}; //dispatch({ type: 'tasks/unCheckRecurring', payload: id });

  const getMenu = () => {
    const items = [];

    if (task.status === StatusTypes.COMPLETED &&
      (task.type !== TasksTypes.RECURRING &&
      task.type !== TasksTypes.SCHEDULED_RECURRING)) {
      items.push({
        label: (
          <IconButton
            className="task__button"
            onClick={unCheck}
            withCTA
          >
            <CheckIcon /> Uncheck
          </IconButton>
        ),
        key: 'uncheck',
      });
    }

    if (task.type === TasksTypes.RECURRING || task.type === TasksTypes.SCHEDULED_RECURRING) {
      if (task.status === StatusTypes.COMPLETED) {
        items.push({
          label: (
            <IconButton
              className="task__button"
              onClick={unCheck}
              withCTA
            >
              <CheckIcon /> Uncheck
            </IconButton>
          ),
          key: 'recurring_uncheck',
        });
      }

      if (task.status !== StatusTypes.COMPLETED) {
        if ('repeatCompletedForWeeks' in task && task.repeatCompletedForWeeks.includes(selectedWeekId)) {
          items.push({
            label: (
              <IconButton
                className="task__button"
                onClick={unCheckRecurring}
                withCTA
              >
                <CheckEmptyIcon /> Uncheck for this week
              </IconButton>
            ),
            key: 'recurring_uncheck',
          });
        }
  
        items.push({
          label: (
            <IconButton
              className="task__button"
              onClick={completeRecurring}
              withCTA
            >
              <StopIcon /> Recurring complete
            </IconButton>
          ),
          key: 'recurring_complete',
        });
      }

      if (task.status !== StatusTypes.COMPLETED) {
        items.push({
          label: (
            <IconButton
              className="task__button"
              onClick={removeRecurringFromThisWeek}
              withCTA
            >
              <FolderDownloadIcon /> Remove for this week
            </IconButton>
          ),
          key: 'recurring_remove_for_week',
        });
      }
    }

    if (task.status !== StatusTypes.COMPLETED) {
      items.push({
        label: (
          <IconButton
            className="task__button"
            onClick={editTaskHandler}
            withCTA
          >
            <PencilIcon /> Edit task
          </IconButton>
        ),
        key: 'recurring_uncheck',
      });
    }

    items.push({
      label: (
        <IconButton
          className="task__button"
          onClick={removeTask}
          withCTA
        >
          <BinIcon /> Remove task
        </IconButton>
      ),
      key: 'remove',
    });

    return (
      <Menu
        items={items}
      />
    );
  }

  return (
    <div className="actions">
      {task.status !== StatusTypes.COMPLETED  &&
      <>
        <IconButton
          className="button__done"
          onClick={completeTask}
        >
          <CheckIcon />
        </IconButton>
        <IconButton
          className="button__done"
          onClick={moveToNextWeek}
        >
          <ArrowCircleRight />
        </IconButton>
      </>
      }
      <Dropdown overlay={getMenu()} trigger={['click']}>
        <a onClick={e => e.preventDefault()}>
          <IconButton onClick={() => {}}>
            <DotsIcon />
          </IconButton>
        </a>
      </Dropdown>
    </div>
  );
}
