import { ApolloError } from 'apollo-server-express';
import { rule } from 'graphql-shield';

import passwordManager from '../../helpers/passwordManager';
import * as Errors from '../../types/enums/error-messages';
import { database } from '../../server';

const isValidPassword = rule()(async (parent, args: { email: string; password: string }) => {
  const usersRef = database.collection('users').doc(args.email);
  const doc = await usersRef.get();
  const user = doc.data();

  if (!user) {
    return new ApolloError(Errors.SignUpErrors.invalidUsernamePassword);
  }
  const checkPassword = await passwordManager.decryptPassword(args.password, user.password);

  if (!checkPassword) {
    return new ApolloError(Errors.SignUpErrors.invalidUsernamePassword);
  }
  return checkPassword;
});

const isUniqueEmail = rule()(async (parent, args, ctx, info) => {
  const isEdit = !!args.input.id;
  const { email } = args.input;
  const usersRef = database.collection('users');
  const doc = await usersRef.doc(email).get();
  const checkUniqueUserEmail = doc.data();
  if (checkUniqueUserEmail) {
    if (isEdit) {
      const queryRef = await usersRef.where('id', '==', args.input.id).get();
      let checkUserById = false;
      queryRef.forEach((doc: any) => (checkUserById = doc.data().id === args.input.id));
      if (checkUserById) {
        return true;
      }
    }
    return new ApolloError(Errors.SignUpErrors.invalidEmail);
  }
  return true;
});

export default {
  isValidPassword,
  isUniqueEmail,
};
