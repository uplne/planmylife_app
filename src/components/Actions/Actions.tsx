import { Menu, Dropdown } from "antd";

import { StatusTypes } from "../../types/status";
import { GoalTasksTypes, GoalSubTasksTypes } from "../../store/Goals/api";
import type { goalTaskActionTypes } from "./types";
import { IconButton } from "../Buttons/IconButton";
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
import type { copyTypes } from "./types";

import "./Actions.css";

type ComponentTypes = {
  task: GoalTasksTypes | GoalSubTasksTypes;
  allow: goalTaskActionTypes[];
  copy: copyTypes;
  complete?: () => void;
  unComplete?: () => void;
  remove?: () => void;
  moveToNextWeek?: () => void;
  editTask?: () => void;
  openAddSubtaskModal?: () => void;
  addToWeek?: () => void;
  openSchedule?: () => void;
  removeTaskFromWeek?: () => void;
  shouldShowRemoveFromTheWeek?: () => boolean;
  removeRecurringFromThisWeek?: () => void;
};

export const defaultCopy = {
  remove: "Remove task",
  unComplete: "Uncheck",
  edit: "Edit task",
  addSubtask: "Add subtask",
  addToWeek: "Add to current week",
  schedule: "Schedule",
  removeFromWeek: "Remove task from week",
};

export const Actions = ({
  task,
  allow,
  copy = {},
  complete = () => {},
  unComplete = () => {},
  remove = () => {},
  moveToNextWeek = () => {},
  editTask = () => {},
  openAddSubtaskModal = () => {},
  addToWeek = () => {},
  openSchedule = () => {},
  removeTaskFromWeek = () => {},
  shouldShowRemoveFromTheWeek = () => false,
  removeRecurringFromThisWeek = () => {},
}: ComponentTypes) => {
  const mergedCopy = {
    ...defaultCopy,
    ...copy,
  };

  const getMenu = () => {
    const items = [];

    if (task.status === StatusTypes.COMPLETED && allow.includes("unComplete")) {
      items.push({
        label: (
          <IconButton
            className="task__button"
            onClick={unComplete}
            primary
            withCTA
          >
            <CheckIcon /> {mergedCopy.unComplete}
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
            onClick={editTask}
            primary
            withCTA
          >
            <PencilIcon /> {mergedCopy.edit}
          </IconButton>
        ),
        key: "edit_task",
      });

      if (allow.includes("addSubtasks")) {
        items.push({
          label: (
            <IconButton
              className="task__button"
              onClick={() => openAddSubtaskModal()}
              primary
              withCTA
            >
              <PlusCircleIcon /> {mergedCopy.addSubtask}
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
                <RocketIcon /> {mergedCopy.addToWeek}
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
                onClick={() => openSchedule()}
                primary
                withCTA
              >
                <ScheduleIcon /> {mergedCopy.schedule}
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
          <IconButton className="task__button" onClick={remove} primary withCTA>
            <BinIcon /> {mergedCopy.remove}
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
            <BinIcon /> {mergedCopy.removeFromWeek}
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
          <IconButton className="button__done" onClick={complete} primary>
            <CheckIcon />
          </IconButton>
          {allow.includes("move") && (
            <IconButton
              className="button__done"
              onClick={moveToNextWeek}
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
