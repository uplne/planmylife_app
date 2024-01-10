import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import { useTasksStore, TasksStoreTypes, TaskType } from '../../store/Tasks';
import { LOADING } from "../../types/status";
import { useAuthStore } from '../../store/Auth';
import { useWeekStore } from '../../store/Week';
import { useConfirmStore } from '../../store/Confirm';
import { useModalStore } from '../../store/Modal';
import { useTaskSchedulerStore } from '../../store/TaskScheduler';
import { StatusTypes, TasksTypes } from '../../types/status';
import { db, Timestamp } from '../../services/firebase';
import { idType } from "../../types/idtype";

export const fetchDefaultData = async () => {
  const userId = await useAuthStore.getState().currentUser.id;
  const selectedWeek = await useWeekStore.getState().selectedWeek;
  const {
    updateIsLoading,
    fillTasks,
  } = await useTasksStore.getState();

  await updateIsLoading(LOADING.FETCHING);

  // Load settings for the user from DB
  try {
    const fromDate = new Date(dayjs(selectedWeek).startOf('week').format());
    const toDate = new Date(dayjs(selectedWeek).endOf('week').format());

    const q = query(collection(db, `tasks/${userId}/default`),
      where("assignedTimestamp", ">=", fromDate),
      where("assignedTimestamp", "<", toDate)
    );

    console.log('fetching firebase for tasks');

    // Create tasks array
    const fetchedTasks: TasksStoreTypes['tasks'] = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const document = doc.data() as TaskType;
      fetchedTasks.push(document);
    });

    // Add tasks to the store
    await fillTasks(fetchedTasks);

    return "success";
  } catch(e) {
    console.log('Fetching tasks failed: ', e);
    await updateIsLoading(LOADING.ERROR);
    return "failed";
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
    date: '',
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
  if (title === '' && id === StatusTypes.NEW) {
    return;
  // If task is empty remove it
  } else if (title === '' && id !== StatusTypes.NEW) {
    await openConfirm({
      title: 'Are you sure you want to delete task?',
      // onConfirm: () => removeTask(id),
    });
  } else {
  // If task is not empty update the title and save it
    await updateTask(task);
  }

  await resetConfirm();
  await resetModal();
};

export const updateTask = async (task: TaskType, fromSync = false) => {
  let newTask = {
    ...task
  };

  if (newTask.id === StatusTypes.NEW) {
    newTask.id = uuidv4();
    await createNewTask(newTask);
  } else {
    // yield put(updateTask(newTask));
    // yield call(saveTaskToDB, newTask.id);
  }

  // yield call(successNotification, NOTIFICATION_MSG.UPDATED, NOTIFICATION_TYPE.SUCCESS);
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
  const userId = await useAuthStore.getState().currentUser.id;
  const taskData = tasks.find((task) => task.id === id);

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