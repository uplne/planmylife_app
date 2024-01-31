// const q = query(collection(db, `tasks/${userId}/default`),
//       where("assignedTimestamp", ">=", fromDate),
//       where("assignedTimestamp", "<", toDate)
//     );

//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//       const document = doc.data() as TaskType;
//       fetchedTasks.push(document);
//     });

//     (getDataCollection as any).mockImplementation(() => ({
//       query: {
//         docs:[{
//           data: () => ({
//             id: 'id-for-this-data-item',
//             name: 'name-for-this-data-item',
//           }),
//         }],
//       },
//     }))

const collection: any = jest.fn(() => {
  return {
    doc: jest.fn(() => {
      return {
        collection: collection,
        update: jest.fn(() => Promise.resolve(true)),
        onSnapshot: jest.fn(() => Promise.resolve(true)),
        get: jest.fn(() => Promise.resolve(true))
      }
    }),
    where: jest.fn(() => {
      return {
        get: jest.fn(() => Promise.resolve(true)),
        onSnapshot: jest.fn(() => Promise.resolve(true)),
      }
    })
  }
});

const query = jest.fn((collection, url) => {

})

const Firestore = () => {
  return {
    collection
  }
}

Firestore.FieldValue = {
  serverTimestamp: jest.fn()
}

export class TestFirebase {
  static initializeApp = jest.fn();

  static auth = jest.fn(() => {
    return {
      createUserAndRetrieveDataWithEmailAndPassword: jest.fn(() => Promise.resolve(true)),
      sendPasswordResetEmail: jest.fn(() => Promise.resolve(true)),
      signInAndRetrieveDataWithEmailAndPassword: jest.fn(() => Promise.resolve(true)),
      fetchSignInMethodsForEmail: jest.fn(() => Promise.resolve(true)),
      signOut: jest.fn(() => Promise.resolve(true)),
      onAuthStateChanged: jest.fn(),
      currentUser: {
        sendEmailVerification: jest.fn(() => Promise.resolve(true))
      }
    }
  });

  static firestore = Firestore;

  static notifications = jest.fn(() => {
    return {
        onNotification: jest.fn(),
        onNotificationDisplayed: jest.fn(),
        onNotificationOpened: jest.fn()
    }
  });

  static messaging = jest.fn(() => {
    return {
        hasPermission: jest.fn(() => Promise.resolve(true)),
        subscribeToTopic: jest.fn(),
        unsubscribeFromTopic: jest.fn(),
        requestPermission: jest.fn(() => Promise.resolve(true)),
        getToken: jest.fn(() => Promise.resolve('RN-Firebase-Token'))
    }
  });

  static storage = jest.fn(() => {
    return {
      ref: jest.fn(() => {
        return {
          child: jest.fn(() => {
            return {
              put: jest.fn(() => Promise.resolve(true))
            }
          })
        }
      })
    }
  })
}