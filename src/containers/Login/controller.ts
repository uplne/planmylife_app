import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { GoogleAuth, auth, signInWithRedirect, db } from '../../services/firebase';

export const LoginWithGoogle = async () => {
  GoogleAuth.addScope('https://www.googleapis.com/auth/userinfo.email');
  GoogleAuth.addScope('https://www.googleapis.com/auth/userinfo.profile');
  auth.useDeviceLanguage();
  GoogleAuth.setCustomParameters({ prompt: 'select_account'});

  try {
    const result = signInWithRedirect(auth, GoogleAuth);
    console.log(result);
  } catch (error) {
    console.error('Signing with redirect: ', error);
  }
};

export const loadUserFromDB = async (user: FirebaseUser) => {
  try {
    const docRef = doc(db, 'users', user.uid);
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
  name?: string,
};

export const storeUserData = async ({ user, name = null}: PropsStoreUserDataTypes) => {
  let userData = null;

  try {
    // Check if we have user already in DB
    userData = await loadUserFromDB(user);
    console.log('LOAD USER DATA: ', userData);
  } catch (e) {
    // Request to retrieve user data failed. We have to assume that user might already exist so we need to throw some error and stop here.
    throw Error('Request failed');
  }

  // If we don't have userData we should store user into DB
  if (!userData) {
    // Set first login
    yield put({
      type: 'settings/setIsFirstLogin',
      payload: true,
    });

    yield call(storeCurrentUser, {
      displayName: name || user.displayName,
      email: user.email,
      uid: user.uid || '',
      push,
    });

    // Create settings
    yield put({ type: 'settings/createSettings' });
  // Or just push data into store
  } else {
    yield call(storeCurrentUserLocally, userData, push);
  }
};