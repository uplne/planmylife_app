import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

import { useGoalsStore, GoalsStoreDefaultTypes } from "../../store/Goals";
import { GoalSubTasksTypes, GoalTasksTypes } from "../../store/Goals/api";
import { DATA_FETCHING_STATUS } from "../../types/status";
import { useAuthStore } from "../../store/Auth";
import { NOTIFICATION_TYPE } from "../../store/Notification";
import { useModalStore } from "../../store/Modal";
import { useConfirmStore } from "../../store/Confirm";
import { StatusTypes, GoalAssignmentTypes } from "../../types/status";
import { idType } from "../../types/idtype";
import {
  saveGoalSubTaskAPI,
  updateGoalSubTaskAPI,
  removeGoalSubTaskAPI,
  updateGoalSubTaskInBulkAPI,
} from "./goals.subtasks.service";
import { showSuccessNotification } from "../../components/Notification/controller";

export const findTaskById = async (id: idType): Promise<GoalTasksTypes> => {
  const storedTasks = await useGoalsStore.getState().tasks;
  const index = storedTasks.findIndex((task) => task.taskId === id);
  const task: GoalTasksTypes = { ...storedTasks[index] };

  return task;
};

export const findSubTaskById = async (
  id: idType,
  where?: GoalSubTasksTypes[],
): Promise<GoalSubTasksTypes> => {
  const storedSubTasks = where || (await useGoalsStore.getState().subtasks);
  const index = storedSubTasks.findIndex((subtask) => subtask.subtaskId === id);
  const task: GoalSubTasksTypes = { ...storedSubTasks[index] };

  return task;
};

export const saveNewGoalSubTasks = async (taskId: idType) => {
  const tempSubTasks = await useGoalsStore.getState().tempSubTasks;
  const fillSubTasks = await useGoalsStore.getState().fillSubTasks;
  const { resetModal } = useModalStore.getState();
  const task: GoalTasksTypes = await findTaskById(taskId);
  const newTasks: GoalSubTasksTypes[] = [];

  Array.from(tempSubTasks).forEach(([_, subtask]) => {
    if (!task.subtasks.some((item) => item.subtaskId === subtask.subtaskId)) {
      newTasks.push({
        goalId: task.goalId,
        taskId: task.taskId,
        subtaskId: uuidv4(),
        status: StatusTypes.ACTIVE,
        title: subtask.title,
        created: dayjs().format(),
        updated: null,
        completed: null,
      });
    }
  });

  if (newTasks.length > 0) {
    await fillSubTasks(newTasks);
    await saveGoalSubTaskAPI(newTasks);
  }

  await resetModal();
};

export const updateSubTask = async (
  subtask: GoalSubTasksTypes,
  newValue?: string,
) => {
  const tempSubTasks = await useGoalsStore.getState().tempSubTasks;
  const updateSubTask = await useGoalsStore.getState().updateSubTask;
  const task: GoalTasksTypes = await findTaskById(subtask.taskId!);
  const storedSubtask: GoalSubTasksTypes = await findSubTaskById(
    subtask.subtaskId!,
    task.subtasks,
  );
  const tempSubtask = tempSubTasks.get(subtask.subtaskId!);
  const { resetModal } = useModalStore.getState();

  const newTitle = () => {
    if (newValue) {
      return newValue;
    } else if (tempSubtask) {
      return tempSubtask.title;
    }
  };

  const updatedSubtask = {
    ...storedSubtask,
    title: newTitle(),
    updated: dayjs().format(),
  };

  await updateSubTask(updatedSubtask);
  await updateGoalSubTaskAPI(updatedSubtask);
  await showSuccessNotification({
    message: "Subtask updated",
    type: NOTIFICATION_TYPE.SUCCESS,
  });
  await resetModal();

  return task;
};

export const completeSubTask = async (subtask: GoalSubTasksTypes) => {
  const updateSubTask = await useGoalsStore.getState().updateSubTask;
  const task: GoalTasksTypes = await findTaskById(subtask.taskId!);
  const storedSubtask: GoalSubTasksTypes = await findSubTaskById(
    subtask.subtaskId!,
    task.subtasks,
  );

  const updatedSubtask = {
    ...storedSubtask,
    status: StatusTypes.COMPLETED,
    updated: dayjs().format(),
    completed: dayjs().format(),
  };

  await updateSubTask(updatedSubtask);
  await updateGoalSubTaskAPI(updatedSubtask);
  await showSuccessNotification({
    message: "Subtask completed",
    type: NOTIFICATION_TYPE.SUCCESS,
  });

  return task;
};

export const completeAllSubtasks = async (
  task: GoalTasksTypes,
): Promise<GoalSubTasksTypes[]> => {
  const storedSubtasks: GoalSubTasksTypes[] = [...task.subtasks];

  // Update subtasks in task
  const newSubtasks = storedSubtasks.map((subtask) => ({
    ...subtask,
    status: StatusTypes.COMPLETED,
    completed: dayjs().format(),
  }));

  // Send bulk update to API
  await updateGoalSubTaskInBulkAPI(newSubtasks);

  return newSubtasks;
};

export const revertCompletedSubTask = async (subtask: GoalSubTasksTypes) => {
  const updateSubTask = await useGoalsStore.getState().updateSubTask;
  const task: GoalTasksTypes = await findTaskById(subtask.taskId!);
  const storedSubtask: GoalSubTasksTypes = await findSubTaskById(
    subtask.subtaskId!,
    task.subtasks,
  );

  const updatedSubtask = {
    ...storedSubtask,
    status: StatusTypes.ACTIVE,
    updated: dayjs().format(),
    completed: null,
  };

  await updateSubTask(updatedSubtask);
  await updateGoalSubTaskAPI(updatedSubtask);
  await showSuccessNotification({
    message: "Subtask set to ACTIVE",
    type: NOTIFICATION_TYPE.SUCCESS,
  });

  return task;
};

export const removeGoalSubTaskConfirmation = async (
  subtask: GoalSubTasksTypes,
) => {
  const { openConfirm, resetConfirm } = useConfirmStore.getState();

  await openConfirm({
    title: "Are you sure you want to delete this subtask?",
    onConfirm: async () => {
      await removeGoalSubTask(subtask);
      await resetConfirm();
    },
  });
};

export const removeGoalSubTask = async (subtask: GoalSubTasksTypes) => {
  const removeGoalSubTask = await useGoalsStore.getState().removeGoalSubTask;

  try {
    await removeGoalSubTask(subtask);
    await removeGoalSubTaskAPI(subtask);
    await showSuccessNotification({
      message: "Task removed",
      type: NOTIFICATION_TYPE.SUCCESS,
    });

    return subtask;
  } catch (e) {
    await showSuccessNotification({
      message: `Task removing failed. ${e as Error}`,
      type: NOTIFICATION_TYPE.FAIL,
    });
  }
};
