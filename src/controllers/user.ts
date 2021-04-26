import { ApolloError } from 'apollo-server-express';
import { firestore } from 'firebase-admin';

import formatString from '../helpers/formatString';
import passwordManager from '../helpers/passwordManager';
import { ROLES } from '../types/enums';
import { IUser } from '../types/user';
import * as Errors from '../types/enums/error-messages';
import { fb, fbAdmin, database } from '../server';

export const signUp = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  role: ROLES,
) => {
  const encryptedPassword = await passwordManager.encryptPassword(password);
  fb.auth()
    .createUserWithEmailAndPassword(email, encryptedPassword)
    .catch(error => {
      console.log(error);
    });

  const entry = database.collection('users').doc(email);
  const newUser = {
    id: entry.id,
    email,
    firstName: formatString(firstName),
    lastName: formatString(lastName),
    password: encryptedPassword,
    role,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  };

  entry.set(newUser);
  return newUser;
};

export const signIn = async (user: string, pass: string) => {
  const usersRef = database.collection('users').doc(user);
  const doc = await usersRef.get();
  const logUser = doc.data();

  if (logUser) {
    const customToken = await fbAdmin.auth().createCustomToken(logUser.id);
    await fb.auth().signInWithCustomToken(customToken);
    const currentUser = await fb.auth().currentUser;
    if (!currentUser) return new ApolloError(Errors.SignInErrors.noUserFound);
    const idToken = currentUser && (await currentUser.getIdToken(/* forceRefresh */ true));

    return {
      userToken: idToken,
      logUser,
    };
  }
  return new ApolloError(Errors.SignInErrors.noUserFound);
};

export const getUser = async (email: string) => {
  const usersRef = database.collection('users').doc(email);
  const doc = await usersRef.get();
  return doc.data();
};

export const updateUser = async (
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  isActive: boolean,
  role: ROLES,
) => {
  const usersRef = database.collection('users').doc(email);
  const doc = await usersRef.get();
  const userToUpdate = doc.data();
  if (!userToUpdate?.email) {
    const encryptedPassword = await passwordManager.encryptPassword('password');
    fb.auth()
      .createUserWithEmailAndPassword(email, encryptedPassword)
      .catch(error => {
        console.log(error);
      });
  } else if (userToUpdate?.email !== email) {
    fb.auth()
      .signInWithEmailAndPassword(userToUpdate?.email, userToUpdate?.password)
      .then(userCredential => {
        userCredential?.user?.updateEmail(email);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const updatedUser = {
    id,
    email,
    firstName: formatString(firstName),
    lastName: formatString(lastName),
    role,
    isActive,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  };

  const response = await usersRef.update(updatedUser);
  return response;
};

export const updatePasswordUser = async (email: string, password: string) => {
  const usersRef = database.collection('users').doc(email);
  const doc = await usersRef.get();
  const userToUpdate = doc.data();
  const encryptedPassword = passwordManager.encryptPassword(password);

  if (userToUpdate?.email) {
    fb.auth()
      .signInWithEmailAndPassword(userToUpdate.email, userToUpdate.password)
      .then(userCredential => {
        userCredential?.user?.updatePassword(encryptedPassword);
      })
      .catch(error => new ApolloError(error));
  } else {
    return new ApolloError(Errors.Validation.changePasswordUser);
  }

  const response = await usersRef.update({
    password: encryptedPassword,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
  return response;
};

export const deleteUser = async (email: string) => {
  const usersRef = database.collection('users').doc(email);
  const response = await usersRef.update({ deleted: true, isActive: false });
  return response;
};

export const sendEmailPassword = async (email: string) => {
  const usersRef = database.collection('users').doc(email);
  const doc = await usersRef.get();
  const res = doc.data();

  if (res !== null) {
    fb.auth()
      .sendPasswordResetEmail(email)
      .catch(error => {
        console.log(error);
      });
  }
  const response = res ? true : false;
  return { email: response };
};

export const confirmPasswordReset = (actionCode: string, newPassword: string) => {
  const response = fb
    .auth()
    .verifyPasswordResetCode(actionCode)
    .then(async email => {
      await fb
        .auth()
        .confirmPasswordReset(actionCode, newPassword)
        .then(async () => {
          const encryptedPassword = passwordManager.encryptPassword(newPassword);
          const usersRef = database.collection('users').doc(email);
          await usersRef.update({
            password: encryptedPassword,
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });
        })
        .catch(error => {
          console.error(error);
        });
      return true;
    })
    .catch(error => {
      console.error(error);
      return false;
    });
  return { response };
};

export const getUserByToken = async () => {
  const currentUser = await fb.auth().currentUser;
  if (!currentUser) return new ApolloError(Errors.SignInErrors.noUserFound);
  const idToken = currentUser && (await currentUser.getIdToken(/* forceRefresh */ true));
  const response = await fbAdmin.auth().verifyIdToken(idToken);
  if (!response) {
    return {
      email: '',
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const usersRef = database.collection('users').doc(response.uid!);
  const doc = await usersRef.get();
  const userFound = doc.data();
  return {
    email: userFound?.email,
    token: idToken,
  };
};

export const getUsers = async (filter = '') => {
  const users: IUser[] = [];
  const usersRef = database.collection('users');
  const queryRef = await usersRef.where('deleted', '==', false).get();
  queryRef.forEach((doc: any) => users.push(doc.data()));
  if (filter !== '') {
    const filteredUsers = users.filter(user =>
      user.firstName.toLocaleLowerCase().includes(filter.toLocaleLowerCase()),
    );
    return filteredUsers;
  }
  return users;
};

export const signOut = () => {
  const response = fb
    .auth()
    .signOut()
    .then(() => true)
    .catch(error => {
      console.error(error);
      return false;
    });
  return { response };
};

export default {
  signUp,
  signIn,
  getUser,
  updateUser,
  updatePasswordUser,
  deleteUser,
  sendEmailPassword,
  confirmPasswordReset,
  getUserByToken,
  getUsers,
  signOut,
};
