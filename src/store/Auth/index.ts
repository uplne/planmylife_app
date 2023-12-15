import { create } from 'zustand';
import { doc, setDoc } from "firebase/firestore";

import { idType } from '../../types/idtype';
import { user } from './api';
import { db } from '../../services/firebase';

type AuthTypes = {
  currentUser: user["schemas"] | null,
  updateCurrentUser: (values: Partial<user["schemas"]>) => void,
  saveCurrentUser: () => void,
  isLoggedIn: boolean,
  setIsLoggedIn: (value: boolean) => void,
  isCheckingAuthState: boolean,
  idToken: string | null,
  uid: string,
  updateUID: (uid: string) => void,
  saveLastLogin: (uid: string) => void,
};

const AuthDefault: AuthTypes = {
  currentUser: null,
  updateCurrentUser: () => null,
  saveCurrentUser: () => null,
  isLoggedIn: false,
  setIsLoggedIn: () => null,
  isCheckingAuthState: false,
  idToken: null,
  uid: null,
  updateUID: () => null,
  saveLastLogin: () => null,
};

export const getAppData = async () => {
  try {
    // load settings from firebase
  } catch(e) {
    console.log('Reading error: ', e);
  }
};

const saveAppState = async (values: Partial<AuthTypes>) => {
  try {
    // save settings to firebase
  } catch (e) {
    console.log('Saving error: ', e);
  }
};

const updateAppState = async (values:Partial<AuthTypes>, state: AuthTypes) => {
  await saveAppState({
    ...state,
    ...values,
  });
};

const saveCurrentUser = async (currentUser: user["schemas"]) => {
  try {
    const docRef = doc(db, 'users', currentUser.id);
    await setDoc(docRef, { ...currentUser }, { merge: true });
  } catch(e) {
    console.log(e);
  }
};

const saveLastLogin = async (date: string, userId: string) => {
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, { lastLogin: date }, { merge: true });
  } catch(e) {
    console.log(e);
  }
};

export const useAuthStore = create<AuthTypes>((set, get) => ({
  currentUser: AuthDefault.currentUser,
  updateCurrentUser: async (values: user["schemas"]) => {
    // await saveAppState({ WeeklyEmailReminder: value });
    console.log('set current user: ', values);
    set({ currentUser: values });
  },
  saveCurrentUser: async () => {
    const currentUser = get().currentUser;
    await saveCurrentUser(currentUser);
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
  saveLastLogin: async (date) => {
    const currentUser = get().currentUser;
    await saveLastLogin(date, currentUser.id);
  }
}));