import { collection, query, where, getDocs } from "firebase/firestore";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

import { useTasksStore, TasksStoreTypes, TaskType } from "../../store/Tasks";
import { DATA_FETCHING_STATUS } from "../../types/status";
import { useAuthStore } from "../../store/Auth";
import { useWeekStore } from "../../store/Week";
import { NOTIFICATION_TYPE } from "../../store/Notification";
import { useConfirmStore } from "../../store/Confirm";
import { useModalStore } from "../../store/Modal";
import {
  useTaskSchedulerStore,
  SchedulerType,
} from "../../store/TaskScheduler";
import { StatusTypes, TasksTypes } from "../../types/status";
import { db } from "../../services/firebase";
import { idType } from "../../types/idtype";
import { updateTaskAPI, removeTaskAPI, saveTaskAPI } from "./tasks.service";
import { showSuccessNotification } from "../Notification/controller";

export const fetchDefaultData = async () => {
  const userId = await useAuthStore.getState().currentUser?.id;
  const selectedWeek = await useWeekStore.getState().selectedWeek;
  const { updateIsLoading, fillTasks } = await useTasksStore.getState();

  await updateIsLoading(DATA_FETCHING_STATUS.FETCHING);

  if (!userId) {
    throw new Error("Save task: No user id");
  }

  // Load settings for the user from DB
  try {
    const fromDate = new Date(dayjs(selectedWeek).startOf("week").format());
    const toDate = new Date(dayjs(selectedWeek).endOf("week").format());
    const q = query(
      collection(db, `tasks/${userId}/default`),
      where("assignedTimestamp", ">=", fromDate),
      where("assignedTimestamp", "<", toDate),
    );

    // Create tasks array
    const fetchedTasks: TasksStoreTypes["tasks"] = [];
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const document = doc.data() as TaskType;
      fetchedTasks.push(document);
    });

    // Add tasks to the store
    await fillTasks(fetchedTasks);
    await updateIsLoading(DATA_FETCHING_STATUS.LOADED);

    return DATA_FETCHING_STATUS.LOADED;
  } catch (e) {
    console.warn("Fetching tasks failed: ", e);
    await updateIsLoading(DATA_FETCHING_STATUS.ERROR);
    return DATA_FETCHING_STATUS.ERROR;
  }
};

export const saveNewTask = async () => {
  const { newTask, schedule } = await useTasksStore.getState();
  const userId = await useAuthStore.getState().currentUser?.id;
  const selectedWeek = await useWeekStore.getState().selectedWeek;
  // const {
  //   repeatType,
  //   repeatTimes,
  //   repeatPeriod,
  // } = useTaskSchedulerStore.getState();
  let newTaskData: TaskType = {
    id: StatusTypes.NEW,
    userId,
    type: TasksTypes.DEFAULT,
    assigned: dayjs(selectedWeek).format(),
    title: newTask,
    status: StatusTypes.NEW,
    created: null,
    createdTimestamp: null,
    updated: null,
    assignedTimestamp: null,
    completed: null,
    moved: [],
    schedule: null,
    repeatCompletedForWeeks: [],
  };

  if (schedule) {
    newTaskData.type = TasksTypes.SCHEDULE;
    newTaskData.assigned = dayjs(schedule).format();
  }

  // // It's recurring task
  // if (repeatType !== SCHEDULER_TYPE['1'].key) {
  //   const type = newTask.type === TASK_TYPE.SCHEDULE ?
  //     TASK_TYPE.SCHEDULED_RECURRING : TASK_TYPE.RECURRING;

  //   newTask = {
  //     ...newTask,
  //     repeatType,
  //     repeatTimes,
  //     repeatPeriod,
  //     type,
  //   };
  // }

  await saveTask(newTaskData);
};

export const saveTask = async (task: TaskType) => {
  const { id, title } = task;
  const { openConfirm, resetConfirm } = useConfirmStore.getState();
  const { resetModal } = useModalStore.getState();

  // If task is empty and is new return here
  if (title === "" && id === StatusTypes.NEW) {
    return;
    // If task is empty remove it
  } else if (title === "" && id !== StatusTypes.NEW) {
    await openConfirm({
      title: "Are you sure you want to delete task?",
      onConfirm: async () => {
        await removeTask(id);
        await resetConfirm();
      },
    });
  } else {
    // If task is not empty update the title and save it
    await updateTask(task);
  }

  await resetModal();
};

export const removeTask = async (id: idType) => {
  const removeTask = await useTasksStore.getState().removeTask;

  try {
    await removeTaskAPI(id);
    await removeTask(id);
    await showSuccessNotification({
      message: "Task removed",
      type: NOTIFICATION_TYPE.SUCCESS,
    });
  } catch (e) {
    await showSuccessNotification({
      message: `Task removing failed. ${e as Error}`,
      type: NOTIFICATION_TYPE.FAIL,
    });
  }
};

export const updateTask = async (task: TaskType) => {
  let newTask = {
    ...task,
  };

  if (newTask.id === StatusTypes.NEW) {
    newTask.id = uuidv4();
    await createNewTask(newTask);
  } else {
    const updateTask = await useTasksStore.getState().updateTask;
    await updateTask(newTask);
    await saveTaskAPI(task.id);
  }

  await showSuccessNotification({
    message: "Task saved",
    type: NOTIFICATION_TYPE.SUCCESS,
  });
};

export const createNewTask = async (task: TaskType) => {
  const { resetModal } = useModalStore.getState();
  let selectedWeek = dayjs().format();

  if (task.assigned) {
    selectedWeek = dayjs(task.assigned).format();
  }

  const newTask: TaskType = {
    ...task,
    status: StatusTypes.ACTIVE,
    created: dayjs().format(),
    createdTimestamp: selectedWeek,
    assignedTimestamp: selectedWeek,
  };

  await useTasksStore.getState().addNewTask(newTask);
  await saveTaskAPI(task.id);
  await resetModal();
};

export const findTaskById = async (id: idType): Promise<TaskType> => {
  const storedTasks = await useTasksStore.getState().tasks;
  const index = storedTasks.findIndex((task) => task.id === id);
  const task: TaskType = storedTasks[index];

  return task;
};

export const completeTask = async (id: idType, recurringCompleted = false) => {
  const selectedWeek = await useWeekStore.getState().selectedWeek;
  const updateTask = await useTasksStore.getState().updateTask;

  const task: TaskType = await findTaskById(id);

  if (
    "type" in task &&
    (task.type === TasksTypes.RECURRING ||
      task.type === TasksTypes.SCHEDULED_RECURRING) &&
    !recurringCompleted
  ) {
    if ("repeatCompletedForWeeks" in task) {
      task.repeatCompletedForWeeks.push(selectedWeek);
    }
  } else {
    task.status = StatusTypes.COMPLETED;
    task.completed = dayjs().format();

    // If the recurring is completed add this date to repeatCompleted as well
    if (recurringCompleted) {
      if ("repeatCompletedForWeeks" in task) {
        task.repeatCompletedForWeeks.push(selectedWeek);
      }
    }
  }

  await updateTask(task);
  await updateTaskAPI(task);
  await showSuccessNotification({
    message: "Task completed",
    type: NOTIFICATION_TYPE.SUCCESS,
  });

  return task;
};

export const revertCompletedTask = async (
  id: idType,
  recurringRevert: boolean,
) => {
  const selectedWeekId = useWeekStore.getState().selectedWeekId;
  const updateTask = await useTasksStore.getState().updateTask;
  const task: TaskType = await findTaskById(id);

  // Revert only one recurrence (for one week)
  if (
    "type" in task &&
    (task.type === TasksTypes.RECURRING ||
      task.type === TasksTypes.SCHEDULED_RECURRING) &&
    recurringRevert
  ) {
    const newArray = task.repeatCompletedForWeeks.filter((week) =>
      dayjs(week).isSame(dayjs(selectedWeekId), "week"),
    );
    task.repeatCompletedForWeeks = newArray;
    // Revert completed
  } else {
    task.status = StatusTypes.ACTIVE;
    task.completed = null;
  }

  await updateTask(task);
  await updateTaskAPI(task);
  await showSuccessNotification({
    message: "Task reverted to status: ACTIVE",
    type: NOTIFICATION_TYPE.SUCCESS,
  });

  return task;
};

export const saveEditedTask = async (id: idType) => {
  const updateNewTask = useTasksStore.getState().updateNewTask;
  const resetModal = useModalStore.getState().resetModal;
  const storedTask: TaskType = await findTaskById(id);
  const { newTask: newTaskTitle, schedule } = await useTasksStore.getState();
  const repeatType = useTaskSchedulerStore.getState().repeatType;
  const repeatTimes = useTaskSchedulerStore.getState().repeatTimes;
  const repeatPeriod = useTaskSchedulerStore.getState().repeatPeriod;

  let newTask = null;

  // If task is a recurring task we need to create a new one and close/stop the edited one
  // But only if we change recurring or schedule
  if (
    (storedTask.type === TasksTypes.RECURRING ||
      storedTask.type === TasksTypes.SCHEDULED_RECURRING) &&
    (Boolean(schedule) !== Boolean(storedTask.schedule) ||
      repeatType !== storedTask.repeatType ||
      repeatTimes !== storedTask.repeatTimes ||
      repeatPeriod !== storedTask.repeatPeriod)
  ) {
    newTask = {
      ...storedTask,
      id: StatusTypes.NEW,
      title: newTaskTitle,
      repeatCompletedForWeeks: [],
    };

    if (schedule) {
      newTask.schedule = schedule;
      newTask.type = TasksTypes.SCHEDULE;
    }

    if (repeatType !== SchedulerType.no) {
      newTask = Object.assign({}, newTask, {
        repeatType,
        repeatTimes,
        repeatPeriod,
        type: schedule ? TasksTypes.SCHEDULED_RECURRING : TasksTypes.RECURRING,
      });
    }

    await completeTask(id, true);
  } else {
    newTask = Object.assign({}, storedTask, {
      title: newTaskTitle,
    });

    if (schedule) {
      newTask.schedule = schedule;
      newTask.type = TasksTypes.SCHEDULE;
    }

    // It's recurring task
    if (repeatType !== SchedulerType.no) {
      newTask = Object.assign({}, newTask, {
        repeatType,
        repeatTimes,
        repeatPeriod,
        type: TasksTypes.RECURRING,
      });
    }
  }

  await saveTask(newTask);
  await resetModal();
  await updateNewTask("");
};

export const moveToNextWeek = async (id: idType) => {
  const storedTask: TaskType = await findTaskById(id);
  let newTask = {
    ...storedTask,
  };

  let movedArray: string[] = [];

  if ("moved" in storedTask) {
    movedArray = [...storedTask.moved];
  }

  if (movedArray.length >= 3) {
    const { openConfirm, resetConfirm } = useConfirmStore.getState();

    // Task has been moved 3 times, time to delete it
    await openConfirm({
      title:
        "You moved this task three times already! Would you like to remove it from weekly planning?",
      subtitle:
        "It's a good practise to split tasks that you are struggling to complete or remove them from your goals altogether.",
      confirmLabel: "Yes, remove",
      cancelLabel: "No, keep",
      onConfirm: async () => {
        await removeTask(id);
        await resetConfirm();
        return;
      },
    });
  }

  if (storedTask?.schedule) {
    movedArray.push(storedTask.schedule);
    newTask.moved = movedArray;
    newTask.schedule = dayjs(storedTask.schedule).add(7, "days").format();
  } else {
    movedArray.push(dayjs().format());
    newTask.moved = movedArray;
    newTask.assigned = dayjs().add(7, "days").format();
  }

  await updateTask(newTask);
};
