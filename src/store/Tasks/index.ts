import { create } from 'zustand';
import moment from 'moment';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../services/firebase';
import uniqBy from 'lodash/uniqBy';

import { useWeekStore } from '../Week';
import { useAuthStore } from '../Auth';
import { TasksAPITypes } from './api';
import { LOADING, TasksTypes } from '../../types/status';

export type TaskType = TasksAPITypes["schemas"][TasksTypes.DEFAULT];

export type TasksStoreTypes = {
  tasks: TaskType[],
  newTask: string,
  fillTasks: (tasks: TaskType[]) => Promise<void>,
  isLoading: LOADING,
  updateIsLoading: (value: LOADING) => void,
  updateNewTask: (value: string) => void,
  schedule: string | undefined,
  setSchedule: (value: string) => void,
  addNewTask: (value: TaskType) => void,
};

const TasksStoreDefault: Partial<TasksStoreTypes> = {
  isLoading: LOADING.NODATA,
  tasks: [],
  newTask: '',
  schedule: undefined,
};

const saveAppState = async (values: Partial<TasksStoreTypes>, userId: string) => {
  try {
    const docRef = doc(db, 'settings', userId);
    await updateDoc(docRef, { ...values });
  } catch (e) {
    console.log('Saving settings error: ', e);
  }
};

export const useTasksStore = create<TasksStoreTypes>((set, get) => ({
  isLoading: TasksStoreDefault.isLoading,
  updateIsLoading: async (value) => {
    set({ isLoading: value });
  },
  tasks: TasksStoreDefault.tasks,
  fillTasks: async (tasks: TaskType[]) => {
    const storedTasks = await get().tasks;
    const newTasks = uniqBy(storedTasks.concat(tasks), 'id');
    await set({
      tasks: newTasks,
    });
  },

  // New task
  newTask: TasksStoreDefault.newTask,
  updateNewTask: async (value: string) => {
    await set({ newTask: value });
  },
  addNewTask: async (value: TaskType) => {
    const storedTasks = await get().tasks;
    await set({ tasks: storedTasks.concat([{
        ...value
      }])
    });
  },

  // Scheduling
  schedule: TasksStoreDefault.schedule,
  setSchedule: async (value: string) => {
    await set({ schedule: value });
  },
}));