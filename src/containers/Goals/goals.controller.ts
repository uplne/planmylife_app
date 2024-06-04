import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

import { useGoalsStore, GoalsStoreDefaultTypes } from "../../store/Goals";
import {
  GoalsAPITypes,
  ProgressType,
  GoalTasksTypes,
} from "../../store/Goals/api";
import { DATA_FETCHING_STATUS } from "../../types/status";
import { useAuthStore } from "../../store/Auth";
import { saveGoalAPI } from "./goals.service";
import { NOTIFICATION_TYPE } from "../../store/Notification";
import { useConfirmStore } from "../../store/Confirm";
import { useModalStore } from "../../store/Modal";
import { StatusTypes } from "../../types/status";
import { idType } from "../../types/idtype";
import { getGoalsAPI, updateGoalAPI, removeGoalAPI } from "./goals.service";
import { showSuccessNotification } from "../../components/Notification/controller";
import { completeTask } from "../Goals/goals.tasks.controller";

export const findGoalById = async (id: idType): Promise<GoalsAPITypes> => {
  const storedGoals = await useGoalsStore.getState().goals;
  const index = storedGoals.findIndex((goal) => goal.goalId === id);
  const goal: GoalsAPITypes = { ...storedGoals[index] };

  return goal;
};

export const fetchActiveGoals = async () => {
  const userId = await useAuthStore.getState().currentUser?.user_id;
  const updateLoadingGoals = await useGoalsStore.getState().updateLoadingGoals;
  const fillGoals = await useGoalsStore.getState().fillGoals;

  await updateLoadingGoals(DATA_FETCHING_STATUS.FETCHING);

  // Load goals for the user from DB
  try {
    if (!userId) {
      throw new Error("Loading goals: No user id");
    }

    // Create tasks array
    let fetchedGoals: GoalsStoreDefaultTypes["goals"] = [];
    fetchedGoals = await getGoalsAPI(StatusTypes.ACTIVE);

    // Add tasks to the store
    await fillGoals(fetchedGoals);
    await updateLoadingGoals(DATA_FETCHING_STATUS.LOADED);

    return DATA_FETCHING_STATUS.LOADED;
  } catch (e) {
    console.warn("Fetching goals failed: ", e);
    await updateLoadingGoals(DATA_FETCHING_STATUS.ERROR);
    return DATA_FETCHING_STATUS.ERROR;
  }
};

export const fetchCompletedGoals = async () => {
  const userId = await useAuthStore.getState().currentUser?.user_id;
  const updateLoadingGoals = await useGoalsStore.getState().updateLoadingGoals;
  const fillGoals = await useGoalsStore.getState().fillGoals;

  await updateLoadingGoals(DATA_FETCHING_STATUS.FETCHING);

  // Load goals for the user from DB
  try {
    if (!userId) {
      throw new Error("Loading completed goals: No user id");
    }

    // Create tasks array
    let fetchedGoals: GoalsStoreDefaultTypes["goals"] = [];
    fetchedGoals = await getGoalsAPI(StatusTypes.COMPLETED);

    // Add tasks to the store
    await fillGoals(fetchedGoals);
    await updateLoadingGoals(DATA_FETCHING_STATUS.LOADED);

    return DATA_FETCHING_STATUS.LOADED;
  } catch (e) {
    console.warn("Fetching goals failed: ", e);
    await updateLoadingGoals(DATA_FETCHING_STATUS.ERROR);
    return DATA_FETCHING_STATUS.ERROR;
  }
};

export const saveGoal = async () => {
  const tempGoal = await useGoalsStore.getState().tempGoal;
  const addNewGoal = await useGoalsStore.getState().addNewGoal;
  const { resetModal } = useModalStore.getState();

  let newGoalData: GoalsAPITypes = {
    goalId: uuidv4(),
    categoryId: tempGoal.categoryId!,
    keyId: uuidv4(),
    goalType: tempGoal.goalType!,
    status: StatusTypes.ACTIVE,
    objective: tempGoal.objective!,
    why: tempGoal.why!,
    assigned: null,
    created: dayjs().format(),
    updated: null,
    completed: null,
    startDate: null,
    endDate: null,
    progressType: tempGoal.progressType!,
    progressPercent: 0,
    progressOwnValue: null,
    progressOwnUnits: null,
  };

  if (tempGoal.startDate) {
    newGoalData.startDate = tempGoal.startDate;
  }

  if (tempGoal.endDate) {
    newGoalData.endDate = tempGoal.endDate;
  }

  if (tempGoal.progressType === ProgressType.OWN) {
    newGoalData.progressOwnUnits = tempGoal.progressOwnUnits || null;
  }

  await addNewGoal(newGoalData);
  await saveGoalAPI(newGoalData);
  await resetModal();
};

export const completeGoal = async (goalId: idType) => {
  const tasks = await useGoalsStore.getState().tasks;
  const resetModal = useModalStore.getState().resetModal;

  // Check if uncompleted task
  const hasUncompleted = tasks.some(
    (task) => task.goalId === goalId && task.status === StatusTypes.ACTIVE,
  );

  if (hasUncompleted) {
    const { openConfirm, resetConfirm } = useConfirmStore.getState();

    await openConfirm({
      title:
        "Some tasks are not completed. This action will mark them as completed. Would you like to proceed?",
      onConfirm: async () => {
        // Complete all tasks
        for (const task of tasks) {
          if (task.goalId === goalId && task.status === StatusTypes.ACTIVE) {
            await completeTask(task.taskId!, true);
          }
        }

        await completeGoalFinish(goalId);
        await resetConfirm();
      },
      onCancel: async () => {
        await resetModal();
      },
    });
  }
};

export const completeGoalFinish = async (goalId: idType) => {
  const updateGoal = await useGoalsStore.getState().updateGoal;

  const goal: GoalsAPITypes = await findGoalById(goalId);

  goal.status = StatusTypes.COMPLETED;
  goal.completed = dayjs().format();

  await updateGoal(goal);
  await updateGoalAPI(goal);
  await showSuccessNotification({
    message: "Goal completed",
    type: NOTIFICATION_TYPE.SUCCESS,
  });

  return goal;
};

export const removeGoal = async (goalId: idType) => {
  const removeGoal = await useGoalsStore.getState().removeGoal;

  try {
    await removeGoalAPI(goalId);
    await removeGoal(goalId);
    await showSuccessNotification({
      message: "Goal removed",
      type: NOTIFICATION_TYPE.SUCCESS,
    });
  } catch (e) {
    await showSuccessNotification({
      message: `Goal removing failed. ${e as Error}`,
      type: NOTIFICATION_TYPE.FAIL,
    });
  }
};

export const revertCompletedGoal = async (goalId: idType) => {};

export const updateGoal = async (goalId: idType) => {
  const updateGoalStore = await useGoalsStore.getState().updateGoal;
  const tempGoal = await useGoalsStore.getState().tempGoal;
  const resetTempGoal = await useGoalsStore.getState().resetTempGoal;
  const { resetModal } = useModalStore.getState();

  console.log("tempGoal: ", tempGoal);

  const goal: GoalsAPITypes = await findGoalById(goalId);

  const updateGoal = {
    ...goal,
    ...tempGoal,
    updated: dayjs().format(),
  };

  await updateGoalStore(updateGoal);
  await updateGoalAPI(updateGoal);
  await showSuccessNotification({
    message: "Goal updated",
    type: NOTIFICATION_TYPE.SUCCESS,
  });
  await resetTempGoal();
  await resetModal();

  return goal;
};
