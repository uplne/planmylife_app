import { create } from 'zustand';

type AppTypes = {
  isLoading: boolean,
  setIsLoading: (value: boolean) => void,
};

const AppDefault: AppTypes = {
  isLoading: true,
  setIsLoading: () => null,
};

export const useAppStore = create<AppTypes>((set) => ({
  isLoading: AppDefault.isLoading,
  setIsLoading: async (value) => {
    set({ isLoading: value });
  },
}));