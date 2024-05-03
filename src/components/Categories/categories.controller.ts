import { v4 as uuidv4 } from "uuid";

import { DATA_FETCHING_STATUS } from "../../types/status";
import { useAuthStore } from "../../store/Auth";
import {
  useCategoriesStore,
  CategoriesStoreDefaultTypes,
} from "../../store/Categories";
import { CategoryAPITypes } from "../../store/Categories/api";
import { getCategoriesAPI, saveCategoryAPI } from "./categories.service";

export const fetchCategoriesData = async () => {
  const userId = await useAuthStore.getState().currentUser?.user_id;
  const updateLoadingCategories =
    await useCategoriesStore.getState().updateLoadingCategories;
  const fillCategories = await useCategoriesStore.getState().fillCategories;

  await updateLoadingCategories(DATA_FETCHING_STATUS.FETCHING);

  // Load settings for the user from DB
  try {
    if (!userId) {
      throw new Error("Get categories: No user id");
    }

    // Create tasks array
    let fetchedCategories: CategoriesStoreDefaultTypes["categories"] = [];
    fetchedCategories = await getCategoriesAPI();

    // Add tasks to the store
    await fillCategories(fetchedCategories);
    await updateLoadingCategories(DATA_FETCHING_STATUS.LOADED);

    return DATA_FETCHING_STATUS.LOADED;
  } catch (e) {
    console.warn("Fetching categories failed: ", e);
    await updateLoadingCategories(DATA_FETCHING_STATUS.ERROR);
    return DATA_FETCHING_STATUS.ERROR;
  }
};

export const saveCategory = async ({ title }: { title: string }) => {
  const addNewCategory = await useCategoriesStore.getState().addNewCategory;

  let newCategory: CategoryAPITypes = {
    categoryId: uuidv4(),
    title,
  };

  await addNewCategory(newCategory);
  return await saveCategoryAPI(newCategory);
};
