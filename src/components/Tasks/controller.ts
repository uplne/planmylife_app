import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import { useTasksStore, TasksStoreTypes, TaskType } from '../../store/Tasks';
import { DATA_FETCHING_STATUS } from "../../types/status";
import { useAuthStore } from '../../store/Auth';
import { useWeekStore } from '../../store/Week';
import { useNotificationStore, NOTIFICATION_TYPE } from "../../store/Notification";
import { useConfirmStore } from '../../store/Confirm';
import { useModalStore } from '../../store/Modal';
import { useTaskSchedulerStore, SCHEDULER_TYPE } from '../../store/TaskScheduler';
import { StatusTypes, TasksTypes } from '../../types/status';
import { db, Timestamp } from '../../services/firebase';
import { idType } from "../../types/idtype";
import { updateTaskAPI, removeTaskAPI } from './api';
import { showSuccessNotification } from '../Notification/controller';

export const fetchDefaultData = async () => {
  const userId = await useAuthStore.getState().currentUser?.id;
  const selectedWeek = await useWeekStore.getState().selectedWeek;
  const {
    updateIsLoading,
    fillTasks,
  } = await useTasksStore.getState();

  await updateIsLoading(DATA_FETCHING_STATUS.FETCHING);

  if (!userId) {
    throw new Error('Save task: No user id');
  }

  // Load settings for the user from DB
  try {
    const fromDate = new Date(dayjs(selectedWeek).startOf('week').format());
    const toDate = new Date(dayjs(selectedWeek).endOf('week').format());
    const q = query(collection(db, `tasks/${userId}/default`),
      where("assignedTimestamp", ">=", fromDate),
      where("assignedTimestamp", "<", toDate)
    );

    // Create tasks array
    const fetchedTasks: TasksStoreTypes['tasks'] = [];
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const document = doc.data() as TaskType;
      fetchedTasks.push(document);
    });

    // Add tasks to the store
    await fillTasks(fetchedTasks);
    await updateIsLoading(DATA_FETCHING_STATUS.LOADED);

    return DATA_FETCHING_STATUS.LOADED;
  } catch(e) {
    console.warn('Fetching tasks failed: ', e);
    await updateIsLoading(DATA_FETCHING_STATUS.ERROR);
    return DATA_FETCHING_STATUS.ERROR;
  }
};

export const saveNewTask = async () => {
  const {
    newTask,
    schedule,
  } = await useTasksStore.getState();
  const selectedWeek = await useWeekStore.getState().selectedWeek;
  const { 
    repeatType,
    repeatTimes,
    repeatPeriod,
  } = useTaskSchedulerStore.getState();
  let newTaskData: TaskType = {
    id: StatusTypes.NEW,
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
    schedule: '',
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

  console.log(saveTask);
  await saveTask(newTaskData);
};

export const saveTask = async (task: TaskType) => {
  const { id, title } = task;
  const { openConfirm, resetConfirm } = useConfirmStore.getState();
  const { resetModal } = useModalStore.getState();

  // If task is empty and is new return here
  if (title === '' && id === StatusTypes.NEW) {
    return;
  // If task is empty remove it
  } else if (title === '' && id !== StatusTypes.NEW) {
    await openConfirm({
      title: 'Are you sure you want to delete task?',
      onConfirm: async () => {
        await removeTask(id);
        await resetConfirm();
      }
    });
  } else {
  // If task is not empty update the title and save it
    await updateTask(task);
  }

  await resetModal();
};

export const removeTask = async (id: idType) => {
  const removeTask = await useTasksStore.getState().removeTask;

  await removeTaskAPI(id);
  await removeTask(id);
  await showSuccessNotification({
    message: 'Task removed',
    type: NOTIFICATION_TYPE.SUCCESS
  });
};

export const updateTask = async (task: TaskType, fromSync = false) => {
  let newTask = {
    ...task
  };

  if (newTask.id === StatusTypes.NEW) {
    newTask.id = uuidv4();
    await createNewTask(newTask);
  } else {
    const updateTask = await useTasksStore.getState().updateTask;
    await updateTask(newTask);
    await saveTaskToDB(task.id);
  }

  await showSuccessNotification({
    message: 'Task saved',
    type: NOTIFICATION_TYPE.SUCCESS
  });
};

export const createNewTask = async (task: TaskType) => {
  let selectedWeek = await useWeekStore.getState().selectedWeek;
  const { resetModal } = useModalStore.getState();

  if (task.assigned) {
    selectedWeek = dayjs(task.assigned).format();
  }

  const timeStamp = Timestamp.fromDate(new Date(selectedWeek));
  const newTask: TaskType = {
    ...task,
    status: StatusTypes.ACTIVE,
    created: dayjs().format(),
    createdTimestamp: timeStamp,
    assignedTimestamp: timeStamp,
  };

  await useTasksStore.getState().addNewTask(newTask);
  await saveTaskToDB(task.id);
  await resetModal();
};

export const saveTaskToDB = async (id: idType) => {
  const tasks = await useTasksStore.getState().tasks;
  const userId = await useAuthStore.getState().currentUser?.id;
  const taskData = tasks.find((task) => task.id === id);

  if (!userId) {
    throw new Error('Save task: No user id');
  }

  try {
    let collection = 'default';

    // // It's recurring task
    // if ('type' in taskData && (taskData.type === TASK_TYPE.RECURRING
    //   || taskData.type === TASK_TYPE.SCHEDULED_RECURRING)) {
    //   collection = 'recurring';
    // }

    try {
      const docRef = doc(db, `tasks/${userId}/${collection}/${id}`);
      await setDoc(docRef, taskData, { merge: true });
    } catch(e) {
      console.log('Failed saving task: ', e);
    }
  } catch(e) {
    console.log(e);
  }
};

export const findTaskById = async (id: idType):Promise<TaskType> => {
  const storedTasks = await useTasksStore.getState().tasks;
  const index = storedTasks.findIndex((task) => task.id === id);
  const task:TaskType = storedTasks[index];

  return task;
}

export const completeTask = async (id:idType, recurringCompleted = false) => {
  const selectedWeek = await useWeekStore.getState().selectedWeek;
  const today = await useWeekStore.getState().today;
  const updateTask = await useTasksStore.getState().updateTask;

  const task = await findTaskById(id);

  if ('type' in task && 
    (task.type === TasksTypes.RECURRING || task.type === TasksTypes.SCHEDULED_RECURRING) &&
    !recurringCompleted) {
    if ('repeatCompleted' in task) {
      task.repeatCompletedForWeeks.push(selectedWeek);
    } else {
      task.repeatCompletedForWeeks = [selectedWeek];
    }
  } else {
    task.status = StatusTypes.COMPLETED;
    task.completed = today.format();

    // If the recurring is completed add this date to repeatCompleted as well
    if (recurringCompleted) {
      if ('repeatCompleted' in task) {
        task.repeatCompletedForWeeks.push(selectedWeek);
      } else {
        task.repeatCompletedForWeeks = [selectedWeek];
      } 
    }
  }

  await updateTask(task);
  await updateTaskAPI(task);
  await showSuccessNotification({
    message: 'Task completed',
    type: NOTIFICATION_TYPE.SUCCESS
  });

  return task;
};

export const revertCompletedTask = async (id: idType, recurringRevert: boolean) => {
  const revertCompleted = useTasksStore.getState().revertCompleted;
  const task = await findTaskById(id);

  await revertCompleted(id, recurringRevert);
  await updateTaskAPI(task);

  await showSuccessNotification({
    message: 'Task reverted to status: ACTIVE',
    type: NOTIFICATION_TYPE.SUCCESS
  });

  return task;
};

export const saveEditedTask = async (id:idType) => {
  const updateNewTask = useTasksStore.getState().updateNewTask;
  const resetModal = useModalStore.getState().resetModal;
  const storedTask:TaskType = await findTaskById(id);
  const {
    newTask:newTaskTitle,
    schedule,
  } = await useTasksStore.getState();
  const { 
    repeatType,
    repeatTimes,
    repeatPeriod,
  } = useTaskSchedulerStore.getState();

  let newTask = null;

  // If task is a recurring task we need to create a new one and close/stop the edited one
  // But only if we change recurring or schedule
  if (storedTask.type === TasksTypes.RECURRING && (
    Boolean(schedule) !== Boolean(storedTask.schedule) ||
    repeatType !== storedTask.repeatType ||
    repeatTimes !== storedTask.repeatTimes ||
    repeatPeriod !== storedTask.repeatPeriod)) {
    newTask = {
      ...storedTask,
      id: StatusTypes.NEW,
      type: TasksTypes.DEFAULT,
      title: newTaskTitle,
    };

    if (schedule) {
      newTask.schedule = schedule;
      newTask.type = TasksTypes.SCHEDULE;
    }

    if (repeatType !== SCHEDULER_TYPE['1'].key) {
      newTask = Object.assign({}, newTask, {
        repeatType,
        repeatTimes,
        repeatPeriod,
        type: TasksTypes.RECURRING,
      });
    }

    // yield call(completeRecurring, { payload: id });
  } else {
    newTask = Object.assign({}, storedTask, {
      title: newTaskTitle,
    });

    if (schedule) {
      newTask.schedule = schedule;
      newTask.type = TasksTypes.SCHEDULE;
    }

    // It's recurring task
    if (repeatType !== SCHEDULER_TYPE['1'].key) {
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
  await updateNewTask('');
};