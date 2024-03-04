import { User as FirebaseUser, UserCredential } from "firebase/auth";
import axios from "axios";
import dayjs from "dayjs";
import { decrypt } from "../../services/encryption";
import { sha256 } from "js-sha256";

import { GoogleAuth, auth, signInWithRedirect } from "../../services/firebase";
import { useSettingsStateStore } from "../../store/Settings";
import { fetchSettings, createSettings } from "../Settings/controller";
import { useAuthStore } from "../../store/Auth";
import { useAppStore } from "../../store/App";
import { getUserById, saveUser, saveLastLogin } from "./api";
import { UserTypes } from "../../store/Auth/api";

export const getUserId = (uid: string) => {
  return sha256(uid);
};

export const LoginWithGoogle = async () => {
  await useAppStore.getState().setIsLoading(true);
  GoogleAuth.addScope("https://www.googleapis.com/auth/userinfo.email");
  GoogleAuth.addScope("https://www.googleapis.com/auth/userinfo.profile");
  auth.useDeviceLanguage();
  GoogleAuth.setCustomParameters({ prompt: "select_account" });

  // TODO Signing with redirect:  FirebaseError: Firebase: Error (auth/popup-blocked).

  try {
    await signInWithRedirect(auth, GoogleAuth);
  } catch (error) {
    console.error("Signing with redirect: ", error);
  }
};

export const ProcessGoogleRedirect = async (result: UserCredential) => {
  await storeUserData({
    user: result.user,
  });
};

type PropsStoreUserDataTypes = {
  user: FirebaseUser;
};

export const storeUserData = async ({ user }: PropsStoreUserDataTypes) => {
  let userData: UserTypes | null = null;
  const userId = await getUserId(user.uid);

  // Store UID locally
  await useAuthStore.getState().updateUID(user.uid);
  const token = await auth.currentUser?.getIdToken();

  // Add token and userId to API requests
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  axios.defaults.headers.common["User"] = userId;

  try {
    // Check if we have user already in DB
    userData = await getUserById(userId);
  } catch (e) {
    // Request to retrieve user data failed. We have to assume that user might already exist so we need to throw some error and stop here.
    throw new Error("Request failed");
  }

  // If we don't have userData we should store user into DB
  if (!userData) {
    // Set first login
    await useSettingsStateStore.getState().updateIsFirstLogin(true);

    // Save user locally
    const created = dayjs().format();
    const currentUser = {
      display_name: user?.displayName || "",
      first_name: user.displayName?.split(" ")[0] || "",
      email: user?.email || "",
      user_id: userId,
      created,
      last_login: created,
    };
    await useAuthStore.getState().updateCurrentUser(currentUser);

    // Save user to DB
    await saveUser(currentUser);

    // // Create settings
    await createSettings();
    // Or just push data into store
  } else {
    const lastLogin = dayjs().format();
    await useAuthStore.getState().updateCurrentUser({
      display_name: await decrypt(userData.display_name),
      first_name: await decrypt(userData.first_name),
      email: await decrypt(userData.email),
      user_id: userId,
      created: userData.created,
      last_login: lastLogin,
    });
    await saveLastLogin(lastLogin, userId);
  }

  await useAuthStore.getState().setIsLoggedIn(true);
};

export const initializeApp = async (redirect: any) => {
  await fetchSettings();

  const isFirstLogin = await useSettingsStateStore.getState().is_first_login;

  if (isFirstLogin) {
    // Start setup
    // yield put(push({ pathname: '/setup' }));
    await useSettingsStateStore.getState().updateIsFirstLogin(false);
    redirect("/myweek");
  } else {
    //checkURLWeek();
    redirect("/myweek");
  }

  // await useAppStore.getState().setIsLoading(false);
};

export const logOut = async (redirect: any) => {
  await auth.signOut();
  await useAuthStore.getState().setIsLoggedIn(false);

  redirect("/logout");
};
