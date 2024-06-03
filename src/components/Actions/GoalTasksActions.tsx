import dayjs from "dayjs";

import { GoalTasksTypes } from "../../store/Goals/api";
import type { goalTaskActionTypes } from "./types";
import { useModalStore } from "../../store/Modal";
import { useWeekStore } from "../../store/Week";
import { AddGoalTask } from "../Goal/AddGoalTask";
import { AddSubTask } from "../Goal/AddSubTask";
import {
  completeTask as completeTaskAction,
  removeGoalTaskConfirmation,
  revertCompletedTask,
  addToWeeklyTasks,
  removeFromWeeklyTasks,
  updateEditedTask,
  moveToNextWeek,
} from "../../containers/Goals/goals.tasks.controller";
import { saveNewGoalSubTasks } from "../../containers/Goals/goals.subtasks.controller";
import { Actions } from "./Actions";

type ComponentTypes = {
  task: GoalTasksTypes;
  allow: goalTaskActionTypes[];
};

export const GoalTaskActions = ({ task, allow }: ComponentTypes) => {
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
      title: "Edit Task",
      onSave: () => updateEditedTask(task.taskId!),
      saveDisabled: false,
      disableAutoClose: true,
    });
  };

  const openAddSubtaskModal = async () => {
    await toggleModal({
      isOpen: true,
      content: <AddSubTask data={task} />,
      title: "Add New SubTask",
      onSave: () => saveNewGoalSubTasks(task.taskId!),
      saveDisabled: false,
      disableAutoClose: true,
    });
  };

  const addToWeek = async () => {
    addToWeeklyTasks(task.taskId!);
  };

  const openSchedule = async () => {};

  const removeTaskFromWeek = async () => {
    removeFromWeeklyTasks(task.taskId!);
  };

  const shouldShowRemoveFromTheWeek = (): boolean =>
    Boolean(
      task?.assigned &&
        dayjs(task.assigned).isSame(dayjs(selectedWeek), "week"),
    );

  return (
    <Actions
      task={task}
      allow={allow}
      complete={completeTask}
      unComplete={unCheck}
      remove={removeTask}
      moveToNextWeek={moveToNextWeekHandler}
      editTask={editTaskHandler}
      openAddSubtaskModal={openAddSubtaskModal}
      addToWeek={addToWeek}
      openSchedule={openSchedule}
      removeTaskFromWeek={removeTaskFromWeek}
      shouldShowRemoveFromTheWeek={shouldShowRemoveFromTheWeek}
    />
  );
};
