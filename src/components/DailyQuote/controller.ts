import { doc, getDoc } from "firebase/firestore";

import { db } from '../../services/firebase';

export const fetchQuotes = async () => {
  // Load settings for the user from DB
  try {
    const docRef = doc(db, 'quotes', 'dailyquote');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const quotesData = docSnap.data();

      return quotesData;
    }
  } catch(e) {
    console.log('Fetching quote failed: ', e);
  }
};
