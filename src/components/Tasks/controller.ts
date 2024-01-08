import { collection, query, where, getDocs } from "firebase/firestore";
import moment from 'moment';
import sortBy from 'lodash/sortBy';

import { useTasksStore, TasksStoreTypes, TaskType } from '../../store/Tasks';
import { LOADING } from "../../types/status";
import { useAuthStore } from '../../store/Auth';
import { useWeekStore } from '../../store/Week';
import { db } from '../../services/firebase';

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
    const fromDate = new Date(moment(selectedWeek).startOf('week').toISOString());
    const toDate = new Date(moment(selectedWeek).endOf('week').toISOString());

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

  } catch(e) {
    console.log('Fetching tasks failed: ', e);
    await updateIsLoading(LOADING.ERROR);
  }
};