import { GoalSubTasksTypes } from "../../store/Goals/api";
import type { goalTaskActionTypes } from "./types";
import { useModalStore } from "../../store/Modal";
import {
  completeSubTask,
  revertCompletedSubTask,
  removeGoalSubTaskConfirmation,
  updateSubTask,
} from "../../containers/Goals/goals.subtasks.controller";
import { Actions } from "./Actions";
import type { copyTypes } from "./types";
import { EditSubTask } from "../Goal/EditSubTask";

type ComponentTypes = {
  task: GoalSubTasksTypes;
  allow: goalTaskActionTypes[];
  copy: copyTypes;
};

export const GoalSubtasksActions = ({
  task,
  allow,
  copy = {},
}: ComponentTypes) => {
  const { toggleModal } = useModalStore();

  const completeTask = async () => {
    await completeSubTask(task);
  };

  const unCheck = async () => {
    await revertCompletedSubTask(task);
  };

  const removeTask = async () => {
    await removeGoalSubTaskConfirmation(task);
  };

  const saveHandler = async () => {
    await updateSubTask(task);
  };

  const editTaskHandler = async () => {
    await toggleModal({
      isOpen: true,
      content: <EditSubTask data={task} />,
      title: "Edit Subtask",
      onSave: () => saveHandler(),
      saveDisabled: false,
      disableAutoClose: true,
    });
  };

  const openSchedule = async () => {};

  return (
    <Actions
      task={task}
      allow={allow}
      complete={completeTask}
      unComplete={unCheck}
      remove={removeTask}
      editTask={editTaskHandler}
      openSchedule={openSchedule}
      copy={copy}
    />
  );
};
