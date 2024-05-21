import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

import { useGoalsStore, GoalsStoreDefaultTypes } from "../../store/Goals";
import { GoalTasksTypes } from "../../store/Goals/api";
import { DATA_FETCHING_STATUS } from "../../types/status";
import { useAuthStore } from "../../store/Auth";
import { NOTIFICATION_TYPE } from "../../store/Notification";
import { useModalStore } from "../../store/Modal";
import { useConfirmStore } from "../../store/Confirm";
import { StatusTypes, GoalAssignmentTypes } from "../../types/status";
import { idType } from "../../types/idtype";
import {
  saveGoalTaskAPI,
  updateGoalTaskAPI,
  removeGoalTaskAPI,
  getGoalTasksAPI,
  getGoalTasksForWeekAPI,
} from "./goals.tasks.service";
import { showSuccessNotification } from "../../components/Notification/controller";

export const findTaskById = async (id: idType): Promise<GoalTasksTypes> => {
  const storedTasks = await useGoalsStore.getState().tasks;
  const index = storedTasks.findIndex((task) => task.taskId === id);
  const task: GoalTasksTypes = { ...storedTasks[index] };

  return task;
};

export const saveNewGoalTask = async (goalId: idType) => {
  const tempTask = await useGoalsStore.getState().tempTask;
  const addNewGoalTask = await useGoalsStore.getState().addNewGoalTask;
  const { resetModal } = useModalStore.getState();

  let newGoalTask: GoalTasksTypes = {
    goalId,
    taskId: uuidv4(),
    status: StatusTypes.ACTIVE,
    assignment: GoalAssignmentTypes.DEFAULT,
    title: tempTask,
    assigned: null,
    created: dayjs().format(),
    updated: null,
    completed: null,
  };

  await addNewGoalTask(newGoalTask);
  await saveGoalTaskAPI(newGoalTask);
  await resetModal();
};

export const fetchGoalsTasks = async (goalId: idType) => {
  const userId = await useAuthStore.getState().currentUser?.user_id;
  // const updateLoadingGoals = await useGoalsStore.getState().updateLoadingGoals;
  const fillTasks = await useGoalsStore.getState().fillTasks;

  // await updateLoadingGoals(DATA_FETCHING_STATUS.FETCHING);

  // Load goals for the user from DB
  try {
    if (!userId) {
      throw new Error("Loading goal tasks: No user id");
    }

    // Create tasks array
    let fetchedGoalTasks: GoalsStoreDefaultTypes["goals"] = [];
    fetchedGoalTasks = await getGoalTasksAPI(goalId);

    // Add tasks to the store
    await fillTasks(fetchedGoalTasks);
    // await updateLoadingGoals(DATA_FETCHING_STATUS.LOADED);

    return DATA_FETCHING_STATUS.LOADED;
  } catch (e) {
    console.warn("Fetching goals failed: ", e);
    // await updateLoadingGoals(DATA_FETCHING_STATUS.ERROR);
    return DATA_FETCHING_STATUS.ERROR;
  }
};

export const fetchGoalsTasksForWeek = async (selectedWeek: string) => {
  const userId = await useAuthStore.getState().currentUser?.user_id;
  const updateLoadingTasksGoals =
    await useGoalsStore.getState().updateLoadingTasksGoals;
  const fillTasks = await useGoalsStore.getState().fillTasks;

  await updateLoadingTasksGoals(DATA_FETCHING_STATUS.FETCHING);

  // Load goal tasks for the selected week
  try {
    if (!userId) {
      throw new Error("Loading goal tasks: No user id");
    }

    // Create tasks array
    let fetchedGoalTasks: GoalsStoreDefaultTypes["goals"] = [];
    fetchedGoalTasks = await getGoalTasksForWeekAPI(selectedWeek);

    // Add tasks to the store
    await fillTasks(fetchedGoalTasks);
    await updateLoadingTasksGoals(DATA_FETCHING_STATUS.LOADED);

    return DATA_FETCHING_STATUS.LOADED;
  } catch (e) {
    console.warn("Fetching goals failed: ", e);
    await updateLoadingTasksGoals(DATA_FETCHING_STATUS.ERROR);
    return DATA_FETCHING_STATUS.ERROR;
  }
};

export const completeTask = async (id: idType) => {
  const updateTask = await useGoalsStore.getState().updateTask;

  const task: GoalTasksTypes = await findTaskById(id);

  task.status = StatusTypes.COMPLETED;
  task.assigned = null;
  task.updated = dayjs().format();
  task.completed = dayjs().format();

  await updateTask(task);
  await updateGoalTaskAPI(task);
  await showSuccessNotification({
    message: "Task completed",
    type: NOTIFICATION_TYPE.SUCCESS,
  });

  return task;
};

export const revertCompletedTask = async (id: idType) => {
  const updateTask = await useGoalsStore.getState().updateTask;

  const task: GoalTasksTypes = await findTaskById(id);

  task.status = StatusTypes.ACTIVE;
  task.completed = null;
  task.updated = dayjs().format();

  await updateTask(task);
  await updateGoalTaskAPI(task);
  await showSuccessNotification({
    message: "Task set to ACTIVE",
    type: NOTIFICATION_TYPE.SUCCESS,
  });

  return task;
};

export const removeGoalTaskConfirmation = async (id: idType) => {
  const { openConfirm, resetConfirm } = useConfirmStore.getState();

  await openConfirm({
    title: "Are you sure you want to delete this task?",
    onConfirm: async () => {
      await removeGoalTask(id);
      await resetConfirm();
    },
  });
};

export const removeGoalTask = async (id: idType) => {
  const removeGoalTask = await useGoalsStore.getState().removeGoalTask;

  const task: GoalTasksTypes = await findTaskById(id);

  task.status = StatusTypes.ACTIVE;
  task.completed = null;
  task.updated = dayjs().format();

  try {
    await removeGoalTask(id);
    await removeGoalTaskAPI(task);
    await showSuccessNotification({
      message: "Task removed",
      type: NOTIFICATION_TYPE.SUCCESS,
    });

    return task;
  } catch (e) {
    await showSuccessNotification({
      message: `Task removing failed. ${e as Error}`,
      type: NOTIFICATION_TYPE.FAIL,
    });
  }
};

export const addToWeeklyTasks = async (id: idType) => {
  const updateTask = await useGoalsStore.getState().updateTask;
  const task: GoalTasksTypes = await findTaskById(id);

  task.status = StatusTypes.ACTIVE;
  task.updated = dayjs().format();
  task.assigned = dayjs().format();
  task.assignment = GoalAssignmentTypes.DEFAULT;

  try {
    await updateTask(task);
    await updateGoalTaskAPI(task);
    await showSuccessNotification({
      message: "Task added to the current week",
      type: NOTIFICATION_TYPE.SUCCESS,
    });

    return task;
  } catch (e) {
    await showSuccessNotification({
      message: `Task removing failed. ${e as Error}`,
      type: NOTIFICATION_TYPE.FAIL,
    });
  }
};

export const removeFromWeeklyTasks = async (id: idType) => {
  const updateTask = await useGoalsStore.getState().updateTask;
  const task: GoalTasksTypes = await findTaskById(id);

  task.updated = dayjs().format();
  task.assigned = null;

  try {
    await updateTask(task);
    await updateGoalTaskAPI(task);
    await showSuccessNotification({
      message: "Task removed from the current week",
      type: NOTIFICATION_TYPE.SUCCESS,
    });

    return task;
  } catch (e) {
    await showSuccessNotification({
      message: `Task removing failed. ${e as Error}`,
      type: NOTIFICATION_TYPE.FAIL,
    });
  }
};
