import { User as FirebaseUser, UserCredential } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import moment from 'moment';
import { sha256 } from 'js-sha256';

import { GoogleAuth, auth, signInWithRedirect, db, GoogleAuthProvider } from '../../services/firebase';
import { useSettingsStateStore } from "../../store/Settings";
import { fetchSettings, createSettings } from '../Settings/controller';
import { useAuthStore } from '../../store/Auth';
import { useAppStore } from '../../store/App';

export const getUserId = (uid: string) => {
  return sha256(uid);
};

export const LoginWithGoogle = async () => {
  await useAppStore.getState().setIsLoading(true);
  GoogleAuth.addScope('https://www.googleapis.com/auth/userinfo.email');
  GoogleAuth.addScope('https://www.googleapis.com/auth/userinfo.profile');
  auth.useDeviceLanguage();
  GoogleAuth.setCustomParameters({ prompt: 'select_account'});

  // TODO Signing with redirect:  FirebaseError: Firebase: Error (auth/popup-blocked).

  try {
    await signInWithRedirect(auth, GoogleAuth);
  } catch (error) {
    console.error('Signing with redirect: ', error);
  }
};

export const ProcessGoogleRedirect = async (result: UserCredential) => {
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
  await storeUserData({
    user: result.user,
  });
};

export const loadUserFromDB = async (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();

      if (userData) {
        return userData;
      }

      return null;
    }
  } catch(e) {
    console.log(e);
  }
};

type PropsStoreUserDataTypes = {
  user: FirebaseUser,
};

export const storeUserData = async ({ user }: PropsStoreUserDataTypes) => {
  let userData = null;
  const userId = await getUserId(user.uid);

  try {
    // Check if we have user already in DB
    userData = await loadUserFromDB(userId);
  } catch (e) {
    // Request to retrieve user data failed. We have to assume that user might already exist so we need to throw some error and stop here.
    throw Error('Request failed');
  }

  // If we don't have userData we should store user into DB
  if (!userData) {
    // Set first login
    await useSettingsStateStore.getState().updateIsFirstLogin(true);

    // Save user locally
    const created = moment().toISOString();
    await useAuthStore.getState().updateCurrentUser({
      displayName: user.displayName,
      firstName:  user.displayName.split(' ')[0],
      email: user.email,
      id: userId,
      created,
      lastLogin: created,
    });

    // Store UID locally
    await useAuthStore.getState().updateUID(user.uid);

    // Save user to DB
    await useAuthStore.getState().saveCurrentUser();

    // // Create settings
    await createSettings();
  // Or just push data into store
  } else {
    const lastLogin = moment().toISOString();
    await useAuthStore.getState().updateCurrentUser({
      displayName: user.displayName,
      firstName:  user.displayName.split(' ')[0],
      email: user.email,
      id: userId,
      lastLogin,
    });
    await useAuthStore.getState().saveLastLogin(lastLogin);
  }

  await useAuthStore.getState().setIsLoggedIn(true);
};

export const initializeApp = async (redirect: any) => {
  await fetchSettings();

  const isFirstLogin = await useSettingsStateStore.getState().isFirstLogin;

  if (isFirstLogin) {
    // Start setup
    // yield put(push({ pathname: '/setup' }));
    await useSettingsStateStore.getState().updateIsFirstLogin(false);
    redirect('/myweek');
  } else {
    //checkURLWeek();
    redirect('/myweek');
  }

  // await useAppStore.getState().setIsLoading(false);
};

export const logOut = async (redirect: any) => {
  await auth.signOut();
  await useAuthStore.getState().setIsLoggedIn(false);

  redirect('/logout');
};