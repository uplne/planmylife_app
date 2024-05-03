import { create } from "zustand";
import uniqBy from "lodash/fp/uniqBy";
import remove from "lodash/remove";

import { CategoryAPITypes } from "./api";
import { DATA_FETCHING_STATUS } from "../../types/status";
import { idType } from "../../types/idtype";

export interface CategoriesStoreDefaultTypes {
  categories: CategoryAPITypes[];
  loadingCategories: DATA_FETCHING_STATUS;
}

export interface CategoriesStoreTypes extends CategoriesStoreDefaultTypes {
  fillCategories: (categories: CategoryAPITypes[]) => Promise<void>;
  updateLoadingCategories: (value: DATA_FETCHING_STATUS) => void;
  addNewCategory: (value: CategoryAPITypes) => void;
  removeCategory: (id: idType) => void;
}

export const CategoriesStoreDefault: CategoriesStoreDefaultTypes = {
  loadingCategories: DATA_FETCHING_STATUS.NODATA,
  categories: [],
};

export const useCategoriesStore = create<CategoriesStoreTypes>((set, get) => ({
  loadingCategories: CategoriesStoreDefault.loadingCategories,
  updateLoadingCategories: async (value) => {
    set({ loadingCategories: value });
  },
  categories: CategoriesStoreDefault.categories,
  fillCategories: async (categories: CategoryAPITypes[]) => {
    const storedCategories = await get().categories;
    const newCategory = uniqBy(
      (item) => item.categoryId,
      storedCategories.concat(categories),
    );

    await set({
      categories: newCategory,
    });
  },
  addNewCategory: async (value: CategoryAPITypes) => {
    const storedCategories = await get().categories;
    await set({
      categories: storedCategories.concat([
        {
          ...value,
        },
      ]),
    });
  },
  removeCategory: async (id: idType) => {
    const storedCategories = [...get().categories];
    remove(storedCategories, (category) => category.categoryId === id);
    await set({ categories: [...storedCategories] });
  },
}));
