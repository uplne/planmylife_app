import { Menu, Dropdown } from "antd";
import dayjs from "dayjs";

import { StatusTypes } from "../../types/status";
import { GoalTasksTypes } from "../../store/Goals/api";
import type { goalTaskActionTypes } from "./types";
import { useModalStore } from "../../store/Modal";
import { useWeekStore } from "../../store/Week";
import { IconButton } from "../Buttons/IconButton";
import { AddGoalTask } from "../Goal/AddGoalTask";
import {
  CheckIcon,
  BinIcon,
  DotsIcon,
  PencilIcon,
  PlusCircleIcon,
  RocketIcon,
  ScheduleIcon,
  ArrowCircleRight,
} from "../Icons";
import {
  completeTask as completeTaskAction,
  removeGoalTaskConfirmation,
  revertCompletedTask,
  addToWeeklyTasks,
  removeFromWeeklyTasks,
  updateEditedTask,
  moveToNextWeek,
} from "../../containers/Goals/goals.tasks.controller";

import "./Actions.css";

type ComponentTypes = {
  task: GoalTasksTypes;
  allow: goalTaskActionTypes[];
};

export const Actions = ({ task, allow }: ComponentTypes) => {
  const { toggleModal } = useModalStore();
  const selectedWeek = useWeekStore().selectedWeek;

  const completeTask = () => {
    completeTaskAction(task.taskId!);
  };

  const unCheck = async () => {
    await revertCompletedTask(task.taskId!);
  };

  const removeTask = async () => {
    removeGoalTaskConfirmation(task.taskId!);
  };

  const moveToNextWeekHandler = async () => {
    await moveToNextWeek(task.taskId!);
  };

  const editTaskHandler = async () => {
    await toggleModal({
      isOpen: true,
      content: <AddGoalTask data={task} editMode />,
      title: "Add New Task",
      onSave: () => updateEditedTask(task.taskId!),
      saveDisabled: false,
      disableAutoClose: true,
    });
  };

  const openAddSubtaskModal = async () => {};

  const addToWeek = async () => {
    addToWeeklyTasks(task.taskId!);
  };

  const openSchedule = async () => {};

  const removeTaskFromWeek = async () => {
    removeFromWeeklyTasks(task.taskId!);
  };

  const shouldShowRemoveFromTheWeek = () =>
    task?.assigned && dayjs(task.assigned).isSame(dayjs(selectedWeek), "week");

  const getMenu = () => {
    const items = [];

    if (task.status === StatusTypes.COMPLETED && allow.includes("unComplete")) {
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

    if (task.status !== StatusTypes.COMPLETED && allow.includes("edit")) {
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

      if (allow.includes("addSubtasks")) {
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
      }

      if (task.status === StatusTypes.ACTIVE) {
        if (allow.includes("addToWeek")) {
          items.push({
            label: (
              <IconButton
                className="task__button"
                onClick={() => addToWeek()}
                primary
                withCTA
              >
                <RocketIcon /> Add to current week
              </IconButton>
            ),
            key: "add_to_current_week",
          });
        }

        if (allow.includes("schedule")) {
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
    }

    if (allow.includes("remove")) {
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
    }

    if (allow.includes("removeFromWeek") && shouldShowRemoveFromTheWeek()) {
      items.push({
        label: (
          <IconButton
            className="task__button"
            onClick={removeTaskFromWeek}
            primary
            withCTA
          >
            <BinIcon /> Remove task from week
          </IconButton>
        ),
        key: "remove_for_week",
      });
    }

    return <Menu items={items} />;
  };

  return (
    <div className="actions">
      {task.status !== StatusTypes.COMPLETED && allow.includes("complete") && (
        <>
          <IconButton className="button__done" onClick={completeTask} primary>
            <CheckIcon />
          </IconButton>
          {allow.includes("move") && (
            <IconButton
              className="button__done"
              onClick={moveToNextWeekHandler}
              primary
            >
              <ArrowCircleRight />
            </IconButton>
          )}
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
