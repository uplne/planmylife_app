import { doc, setDoc, deleteDoc } from "firebase/firestore";

import { TasksTypes } from '../../types/status';
import { db } from '../../services/firebase';

import { TaskType } from '../../store/Tasks';
import { useAuthStore } from '../../store/Auth';
import { useTasksStore } from '../../store/Tasks';
import { showSuccessNotification } from '../Notification/controller';
import { idType } from "../../types/idtype";

export const updateTaskAPI = async (newTaskData: TaskType) => {
  const userId = await useAuthStore.getState().currentUser?.id;

  if (!userId) {
    throw new Error('Save task: No user id');
  }

  try {
    let collection = 'default';

    // It's recurring task
    if ('type' in newTaskData && (newTaskData.type === TasksTypes.RECURRING
      || newTaskData.type === TasksTypes.SCHEDULED_RECURRING)) {
      collection = 'recurring';
    }

    const docRef = doc(db, `tasks/${userId}/${collection}/${newTaskData.id}`);
    await setDoc(docRef, newTaskData, { merge: true });
    await showSuccessNotification();
  } catch(e) {
    throw new Error(`Failed to update task: ${newTaskData.id}, error: ${e}`);
  }
};

export const removeTaskAPI = async (id: idType) => {
  const userId = await useAuthStore.getState().currentUser?.id;

  if (!userId) {
    throw new Error('Save task: No user id');
  }

  try {
    const storedTasks = await useTasksStore.getState().tasks;
    const taskData = storedTasks.find((task) => task.id === id);

    let collection = 'default';

    // It's recurring task
    if (taskData && 'type' in taskData &&
      (taskData.type === TasksTypes.RECURRING ||
      taskData.type === TasksTypes.SCHEDULED_RECURRING)) {
      collection = 'recurring';
    }

    const docRef = doc(db, `tasks/${userId}/${collection}/${id}`);
    await deleteDoc(docRef);
  } catch(e) {
    throw new Error(`Failed to delete task: ${id}, error: ${e}`);
  }
};