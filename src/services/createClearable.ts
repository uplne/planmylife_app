import { create as _create } from "zustand";
import type { StateCreator } from "zustand";

const storeResetFns = new Set<() => void>();

export const resetAllStores = async () => {
  await storeResetFns.forEach(async (resetFn) => {
    await resetFn();
  });
};

export const createClearable = <T extends unknown>(
  stateCreator: StateCreator<T>,
) => {
  const store = _create(stateCreator);
  const initialState = store.getState();

  storeResetFns.add(() => {
    store.setState(initialState, true);
  });

  return store;
};
