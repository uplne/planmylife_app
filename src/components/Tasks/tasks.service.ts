import axios from "axios";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

import { TasksTypes } from "../../types/status";
import { db, CollectionType } from "../../services/firebase";

import { TaskType } from "../../store/Tasks";
import { useAuthStore } from "../../store/Auth";
import { useTasksStore } from "../../store/Tasks";
import { showSuccessNotification } from "../Notification/controller";
import { idType } from "../../types/idtype";

export const getTasks = async (
  from: string,
  to: string,
  type: TasksTypes = TasksTypes.DEFAULT,
) => {
  try {
    const userId = await useAuthStore.getState().currentUser?.id;
    const response = await axios.get(
      `http://localhost:3001/api/v1/tasks/${userId}/${type}/${from}/${to}`,
    );

    if (response.data && response.data.length > 0) {
      return response.data[0];
    }

    return null;
  } catch (e) {
    throw new Error(`Get ${type} tasks: ${e}`);
  }
};

export const updateTaskAPI = async (newTaskData: TaskType) => {
  const userId = await useAuthStore.getState().currentUser?.id;

  if (!userId) {
    throw new Error("Save task: No user id");
  }

  try {
    let collection: CollectionType = "default";

    // It's recurring task
    if (
      "type" in newTaskData &&
      (newTaskData.type === TasksTypes.RECURRING ||
        newTaskData.type === TasksTypes.SCHEDULED_RECURRING)
    ) {
      collection = "recurring";
    }

    const docRef = doc(db, `tasks/${userId}/${collection}/${newTaskData.id}`);
    await setDoc(docRef, newTaskData, { merge: true });
    await showSuccessNotification();
  } catch (e) {
    throw new Error(`Failed to update task: ${newTaskData.id}, error: ${e}`);
  }
};

export const removeTaskAPI = async (id: idType) => {
  const userId = await useAuthStore.getState().currentUser?.id;

  if (!userId) {
    throw new Error("Save task: No user id");
  }

  try {
    const storedTasks = await useTasksStore.getState().tasks;
    const taskData = storedTasks.find((task) => task.id === id);

    let collection: CollectionType = "default";

    // It's recurring task
    if (
      taskData &&
      "type" in taskData &&
      (taskData.type === TasksTypes.RECURRING ||
        taskData.type === TasksTypes.SCHEDULED_RECURRING)
    ) {
      collection = "recurring";
    }

    const docRef = doc(db, `tasks/${userId}/${collection}/${id}`);
    await deleteDoc(docRef);
  } catch (e) {
    throw new Error(`Failed to delete task: ${id}, error: ${e}`);
  }
};

export const saveTaskAPI = async (id: idType) => {
  const tasks = await useTasksStore.getState().tasks;
  const userId = await useAuthStore.getState().currentUser?.id;
  const taskData = tasks.find((task) => task.id === id);

  if (!userId) {
    throw new Error("Save task: No user id");
  }

  try {
    let collection: CollectionType = "default";

    // It's recurring task
    if (
      taskData &&
      "type" in taskData &&
      (taskData.type === TasksTypes.RECURRING ||
        taskData.type === TasksTypes.SCHEDULED_RECURRING)
    ) {
      collection = "recurring";
    }

    try {
      const docRef = doc(db, `tasks/${userId}/${collection}/${id}`);
      await setDoc(docRef, taskData, { merge: true });
    } catch (e) {
      console.log("Failed saving task: ", e);
    }
  } catch (e) {
    console.log(e);
  }
};
