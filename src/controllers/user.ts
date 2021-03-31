import { ApolloError } from 'apollo-server-express';

import formatString from '../helpers/formatString';
import formatUsername from '../helpers/formatUsername';
import passwordManager from '../helpers/passwordManager';
import { fb, fbAdmin } from '../index';
import User from '../models/user';
import { ROLES } from '../types/enums';
import * as Errors from '../types/enums/error-messages';

export const signUp = async (
  username: string,
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
  const NewUser = new User({
    username: formatUsername(username),
    email,
    firstName: formatString(firstName),
    lastName: formatString(lastName),
    password: encryptedPassword,
    role,
  });
  const savedUser = await NewUser.save();
  return savedUser;
};

export const signIn = async (user: string, pass: string) => {
  const logUser = await User.findOne({
    $or: [{ username: formatUsername(user) }, { email: user }],
  });

  if (logUser) {
    const customToken = await fbAdmin.auth().createCustomToken(logUser.id);
    await fb.auth().signInWithCustomToken(customToken);
    const currentUser = await fb.auth().currentUser;
    if (!currentUser) return new ApolloError(Errors.SignInErrors.noUserFound);
    const idToken = currentUser && (await currentUser.getIdToken(/* forceRefresh */ true));

    return {
      username: logUser.username,
      userToken: idToken,
      userRole: logUser.role,
    };
  }
  return new ApolloError(Errors.SignInErrors.noUserFound);
};

export const getUser = async (id: string) =>
  User.findOne({
    _id: id,
  });

export const updateUser = async (
  id: string,
  username: string,
  email: string,
  firstName: string,
  lastName: string,
  isActive: boolean,
  role: ROLES,
) => {
  const userToUpdate = await User.findById(id);
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

  const response = await User.findOneAndUpdate(
    { _id: id },
    {
      username: formatUsername(username),
      email,
      firstName: formatString(firstName),
      lastName: formatString(lastName),
      role,
      isActive,
    },
    { new: true },
  );
  return response;
};

export const updatePasswordUser = async (id: string, password: string) => {
  const userToUpdate = await User.findById(id);
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

  const response = await User.findOneAndUpdate(
    { _id: id },
    {
      password: encryptedPassword,
    },
    { new: true },
  );
  return response;
};

export const deleteUser = async (id: string) => {
  const response = await User.findOneAndUpdate(
    {
      _id: id,
      deleted: false,
    },
    { deleted: true },
    { new: true },
  );
  return response;
};

export const sendEmailPassword = async (email: string) => {
  const res = await User.findOneAndUpdate(
    {
      email,
    },
    { new: true },
  );
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
          await User.findOneAndUpdate(
            { email },
            {
              password: encryptedPassword,
            },
            { new: true },
          );
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
      username: '',
    };
  }
  const userFound = await User.findById(response.uid);
  return {
    username: userFound?.username,
    token: idToken,
  };
};

export const getUsers = async (filter = '') =>
  User.find({
    $and: [
      {
        $or: [
          { username: { $regex: filter, $options: 'i' } },
          { email: { $regex: filter, $options: 'i' } },
          { firstName: { $regex: filter, $options: 'i' } },
          { lastName: { $regex: filter, $options: 'i' } },
        ],
      },
      {
        deleted: false,
      },
    ],
  }).exec();

export const signInMobile = async (user: string, pass: string) => {
  const logUser = await User.findOne({
    $or: [{ username: formatUsername(user) }, { email: user }],
  });

  const currentUser = await fb.auth().currentUser;
  if (!currentUser) return new ApolloError(Errors.SignInErrors.noUserFound);
  const idToken = currentUser && (await currentUser.getIdToken(/* forceRefresh */ true));

  return {
    username: logUser?.username,
    userToken: idToken,
    userRole: logUser?.role,
    firstName: logUser?.firstName,
    lastName: logUser?.lastName,
    email: logUser?.email,
  };
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
  signInMobile,
  signOut,
};
