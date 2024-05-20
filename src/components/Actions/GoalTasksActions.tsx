import { Menu, Dropdown } from "antd";

import { StatusTypes } from "../../types/status";
import { GoalTasksTypes } from "../../store/Goals/api";

import { useModalStore } from "../../store/Modal";
import { IconButton } from "../Buttons/IconButton";
import {
  CheckIcon,
  BinIcon,
  DotsIcon,
  PencilIcon,
  PlusCircleIcon,
  RocketIcon,
  ScheduleIcon,
} from "../Icons";
import {
  completeTask as completeTaskAction,
  removeGoalTaskConfirmation,
  revertCompletedTask,
} from "../../containers/Goals/goals.tasks.controller";

import "./Actions.css";

type ComponentTypes = {
  task: GoalTasksTypes;
};

export const Actions = ({ task }: ComponentTypes) => {
  const { toggleModal } = useModalStore();

  const completeTask = () => {
    completeTaskAction(task.taskId!);
  };

  const removeTask = async () => {
    removeGoalTaskConfirmation(task.taskId!);
  };

  const moveToNextWeekHandler = async () => {
    // await moveToNextWeek(task.taskId);
  };

  const unCheck = async () => {
    await revertCompletedTask(task.taskId!);
  };

  const editTaskHandler = async () => {};

  const openAddSubtaskModal = async () => {};

  const addToWeek = async () => {};

  const openSchedule = async () => {};

  const getMenu = () => {
    const items = [];

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
        key: "uncheck",
      });
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

      items.push({
        label: (
          <IconButton
            className="task__button"
            onClick={() => openAddSubtaskModal(task)}
            primary
            withCTA
          >
            <PlusCircleIcon /> Add subtask
          </IconButton>
        ),
        key: "add_subtask",
      });

      if (task.status === StatusTypes.ACTIVE) {
        items.push({
          label: (
            <IconButton
              className="task__button"
              onClick={() => addToWeek(task)}
              primary
              withCTA
            >
              <RocketIcon /> Add to current week
            </IconButton>
          ),
          key: "add_to_current_week",
        });
        items.push({
          label: (
            <IconButton
              className="task__button"
              onClick={() => openSchedule(task)}
              primary
              withCTA
            >
              <ScheduleIcon /> Schedule
            </IconButton>
          ),
          key: "schedule",
        });
      }
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
      {task.status !== StatusTypes.COMPLETED && (
        <IconButton className="button__done" onClick={completeTask} primary>
          <CheckIcon />
        </IconButton>
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
