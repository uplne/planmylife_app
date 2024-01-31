import { doc, setDoc } from "firebase/firestore";

import { TasksTypes } from '../../types/status';
import { db } from '../../services/firebase';

import { TaskType } from '../../store/Tasks';
import { useAuthStore } from '../../store/Auth';
import { showSuccessNotification } from '../Notification/controller';

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
    console.log(e);
  }
};