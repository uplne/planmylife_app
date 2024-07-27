import { createClearable } from "../../services/createClearable";

type AppTypes = {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};

const AppDefault: AppTypes = {
  isLoading: false,
  setIsLoading: () => null,
};

export const useAppStore = createClearable<AppTypes>((set) => ({
  isLoading: AppDefault.isLoading,
  setIsLoading: async (value) => {
    set({ isLoading: value });
  },
}));
