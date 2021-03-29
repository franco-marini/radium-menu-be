import { ApolloError } from 'apollo-server-express';
import { rule } from 'graphql-shield';

import formatUsername from '../../helpers/formatUsername';
import passwordManager from '../../helpers/passwordManager';
import User from '../../models/user';
import * as Errors from '../../types/enums/error-messages';

const isValidPassword = rule()(
  async (parent, args: { username: string; password: string }) => {
    const user = await User.findOne({
      $or: [
        { username: formatUsername(args.username) },
        { email: args.username },
      ],
    });

    if (!user) {
      return new ApolloError(Errors.SignUpErrors.invalidUsernamePassword);
    }
    const checkPassword = await passwordManager.decryptPassword(
      args.password,
      user.password,
    );

    if (!checkPassword) {
      return new ApolloError(Errors.SignUpErrors.invalidUsernamePassword);
    }
    return checkPassword;
  },
);

const isUniqueUser = rule()(async (parent, args, ctx, info) => {
  const isEdit: boolean = args.input.id ? true : false;
  const userFormat = formatUsername(args.input.username);
  const checkUniqueUser = await User.findOne({
    username: userFormat,
  });
  if (checkUniqueUser) {
    if (isEdit) {
      const checkUserById = await User.findOne({ _id: args.input.id });
      if (checkUserById.username === userFormat) {
        return true;
      }
    }
    return new ApolloError(Errors.SignUpErrors.invalidUsername);
  }
  return true;
});

const isUniqueEmail = rule()(async (parent, args, ctx, info) => {
  const isEdit: boolean = !!args.input.id;
  const { email } = args.input;
  const checkUniqueUserEmail = await User.findOne({
    email,
  });
  if (checkUniqueUserEmail) {
    if (isEdit) {
      const checkUserById = await User.findOne({ _id: args.input.id });
      if (checkUserById.email === email) {
        return true;
      }
    }
    return new ApolloError(Errors.SignUpErrors.invalidEmail);
  }
  return true;
});

export default {
  isValidPassword,
  isUniqueUser,
  isUniqueEmail,
};
