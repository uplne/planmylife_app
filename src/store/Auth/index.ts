import { createClearable } from "../../services/createClearable";
import { UserTypes } from "./api";

type AuthTypes = {
  currentUser: UserTypes | null;
  updateCurrentUser: (values: UserTypes) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  isCheckingAuthState: boolean;
  idToken: string | null;
  uid: string | null;
  updateUID: (uid: string) => void;
};

export const AuthDefault: AuthTypes = {
  currentUser: null,
  updateCurrentUser: () => null,
  isLoggedIn: false,
  setIsLoggedIn: () => null,
  isCheckingAuthState: false,
  idToken: null,
  uid: null,
  updateUID: () => null,
};

export const useAuthStore = createClearable<AuthTypes>((set) => ({
  currentUser: AuthDefault.currentUser,
  updateCurrentUser: (values: UserTypes) => {
    set({ currentUser: values });
  },
  isLoggedIn: AuthDefault.isLoggedIn,
  setIsLoggedIn: async (value: boolean) => {
    set({ isLoggedIn: value });
  },
  isCheckingAuthState: AuthDefault.isCheckingAuthState,
  idToken: AuthDefault.idToken,
  uid: AuthDefault.uid,
  updateUID: async (uid) => {
    set({ uid });
  },
}));
