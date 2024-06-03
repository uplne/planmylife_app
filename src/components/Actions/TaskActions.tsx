import { Menu, Dropdown } from "antd";

import { TasksTypes, StatusTypes } from "../../types/status";
import { TaskType } from "../../store/Tasks/index";
import {
  revertCompletedTask,
  saveTask,
  saveEditedTask,
  moveToNextWeek,
} from "../Tasks/tasks.controller";
import { useModalStore } from "../../store/Modal";
import { IconButton } from "../../components/Buttons/IconButton";
import {
  CheckIcon,
  BinIcon,
  ArrowCircleRight,
  DotsIcon,
  CheckEmptyIcon,
  PencilIcon,
  StopIcon,
  FolderDownloadIcon,
} from "../../components/Icons";
import { AddTask } from "../Tasks/TaskModal/AddTask";
import {
  completeTask as completeTaskAction,
  removeRecurringFromWeek,
  completeRecurring,
  unCheckRecurring,
} from "../Tasks/tasks.controller";

import "./Actions.css";

type ComponentTypes = {
  task: TaskType;
};

export const Actions = ({ task }: ComponentTypes) => {
  const { toggleModal } = useModalStore();

  const completeTask = () => {
    completeTaskAction(task.taskId);
  };

  const removeTask = async () => {
    await saveTask({
      ...task,
      title: "",
    });
  };

  const moveToNextWeekHandler = async () => {
    await moveToNextWeek(task.taskId);
  };

  const unCheck = async () => {
    await revertCompletedTask(task.taskId, false);
  };

  const editTaskHandler = async () => {
    await toggleModal({
      isOpen: true,
      content: <AddTask task={task} editMode />,
      title: "Edit Task",
      onSave: () => saveEditedTask(task.taskId),
      disableAutoClose: true,
    });
  };

  const removeRecurringFromThisWeek = async () => {
    await removeRecurringFromWeek(task.taskId);
  };

  const completeRecurringHandler = async () => {
    await completeRecurring(task.taskId);
  };
  const unCheckRecurringHandler = async () => {
    await unCheckRecurring(task.taskId);
  };

  const getMenu = () => {
    const items = [];

    if (
      task.status === StatusTypes.COMPLETED &&
      task.type !== TasksTypes.RECURRING &&
      task.type !== TasksTypes.SCHEDULED_RECURRING
    ) {
      items.push({
        label: (
          <IconButton
            className="task__button"
            onClick={unCheck}
            primary
            withCTA
          >
            <CheckIcon /> Uncheck
          </IconButton>
        ),
        key: "uncheck",
      });
    }

    if (
      task.type === TasksTypes.RECURRING ||
      task.type === TasksTypes.SCHEDULED_RECURRING
    ) {
      if (task.status === StatusTypes.COMPLETED) {
        items.push({
          label: (
            <IconButton
              className="task__button"
              onClick={unCheck}
              primary
              withCTA
            >
              <CheckIcon /> Uncheck
            </IconButton>
          ),
          key: "recurring_uncheck",
        });
      }

      if (task.status !== StatusTypes.COMPLETED) {
        if ("repeatCompletedForWeeks" in task && task.completedForThisWeek) {
          items.push({
            label: (
              <IconButton
                className="task__button"
                onClick={unCheckRecurringHandler}
                primary
                withCTA
              >
                <CheckEmptyIcon /> Uncheck for this week
              </IconButton>
            ),
            key: "recurring_uncheck",
          });
        }

        items.push({
          label: (
            <IconButton
              className="task__button"
              onClick={completeRecurringHandler}
              primary
              withCTA
            >
              <StopIcon /> Recurring complete
            </IconButton>
          ),
          key: "recurring_complete",
        });
      }

      if (task.status !== StatusTypes.COMPLETED) {
        items.push({
          label: (
            <IconButton
              className="task__button"
              onClick={removeRecurringFromThisWeek}
              primary
              withCTA
            >
              <FolderDownloadIcon /> Remove for this week
            </IconButton>
          ),
          key: "recurring_remove_for_week",
        });
      }
    }

    if (task.status !== StatusTypes.COMPLETED) {
      items.push({
        label: (
          <IconButton
            className="task__button"
            onClick={editTaskHandler}
            primary
            withCTA
          >
            <PencilIcon /> Edit task
          </IconButton>
        ),
        key: "edit_task",
      });
    }

    items.push({
      label: (
        <IconButton
          className="task__button"
          onClick={removeTask}
          primary
          withCTA
        >
          <BinIcon /> Remove task
        </IconButton>
      ),
      key: "remove",
    });

    return <Menu items={items} />;
  };

  return (
    <div className="actions">
      {!task.completedForThisWeek && task.status !== StatusTypes.COMPLETED && (
        <>
          <IconButton className="button__done" onClick={completeTask} primary>
            <CheckIcon />
          </IconButton>
          <IconButton
            className="button__done"
            onClick={moveToNextWeekHandler}
            primary
          >
            <ArrowCircleRight />
          </IconButton>
        </>
      )}
      <Dropdown overlay={getMenu()} trigger={["click"]}>
        <a onClick={(e) => e.preventDefault()}>
          <IconButton onClick={() => {}} primary>
            <DotsIcon />
          </IconButton>
        </a>
      </Dropdown>
    </div>
  );
};
