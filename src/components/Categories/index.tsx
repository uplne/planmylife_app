import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchCategoriesData, saveCategory } from "./categories.controller";
import { useCategoriesStore } from "../../store/Categories";
import { DATA_FETCHING_STATUS } from "../../types/status";
import { BasicButton } from "../Buttons/BasicButton";
import { Preloader } from "../Preloader";
import { Input } from "../Input";

export const useFetchCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategoriesData,
    staleTime: 86400000, // set to 1 day
  });

type ComponentProps = {
  categoryId?: string;
  onChange?: (categoryId: string | null) => void;
};

export const Categories = ({ categoryId, onChange }: ComponentProps) => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const categories = useCategoriesStore().categories;
  const loadingCategories = useCategoriesStore().loadingCategories;

  useFetchCategories();

  useEffect(() => {
    if (categoryId) {
      selectCategoryHandler(categoryId);
    }
  }, []);

  const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewCategory(e.target.value);

  const onInputClose = () => {
    setNewCategory("");
    setShowAddCategory(false);
  };

  const addCategory = async () => {
    setAddingCategory(true);
    await saveCategory({ title: newCategory });
    await setSelectedCategory(null);
    await setShowAddCategory(false);
    setAddingCategory(false);
  };

  const selectCategoryHandler = async (id: string | null) => {
    let newSelectedCategory = id;

    if (newSelectedCategory === selectedCategory) {
      newSelectedCategory = null;
    }

    await setSelectedCategory(newSelectedCategory);

    if (onChange) {
      await onChange(newSelectedCategory);
    }
  };

  if (loadingCategories === DATA_FETCHING_STATUS.FETCHING) {
    return <Preloader small />;
  }

  if (showAddCategory) {
    return (
      <div className="flex flex-row w-full">
        <Input
          className="w-full"
          autoFocus
          value={newCategory}
          onChange={inputOnChange}
        />
        <BasicButton
          className="modal__button"
          ternary
          onClick={addCategory}
          loading={addingCategory}
          disabled={newCategory === "" || addingCategory}
        >
          Add
        </BasicButton>
        <BasicButton className="modal__button" ternary onClick={onInputClose}>
          Cancel
        </BasicButton>
      </div>
    );
  }

  return (
    <div className="flex flex-row">
      {categories.map((category) => {
        return (
          <BasicButton
            className="mr-2"
            onClick={() => selectCategoryHandler(category.categoryId)}
            secondary
            isActive={selectedCategory === category.categoryId}
          >
            {category.title}
          </BasicButton>
        );
      })}
      <BasicButton
        className="flex grow-0"
        onClick={() => setShowAddCategory(true)}
        secondary
      >
        Add Category
      </BasicButton>
    </div>
  );
};
