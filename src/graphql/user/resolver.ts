import users from '../../controllers/user';
import { ISignUpUserInput, IUpdateUserInput } from '../../types/user';

export const userResolvers = {
  Query: {
    user: (_: any, { id }: { id: string }) => users.getUser(id),
    users: async (_: any, { filter }: { filter: string }) =>
      users.getUsers(filter),
    checkForeignToken: (_: any) => users.getUserByToken(),
  },
  Mutation: {
    signUp: (
      _: any,
      {
        input: { username, email, firstName, lastName, password, role },
      }: ISignUpUserInput,
    ) => users.signUp(username, email, firstName, lastName, password, role),
    signIn: (
      _: any,
      { username, password }: { username: string; password: string },
    ) => users.signIn(username, password),
    updateUser: (
      _: any,
      {
        input: { id, username, email, firstName, lastName, isActive, role },
      }: IUpdateUserInput,
    ) =>
      users.updateUser(
        id,
        username,
        email,
        firstName,
        lastName,
        isActive,
        role,
      ),
    updatePasswordUser: (
      _: any,
      { input: { id, password } }: IUpdateUserInput,
    ) => users.updatePasswordUser(id, password),
    deleteUser: (_: any, { id }: { id: string }) => users.deleteUser(id),
    sendEmailPassword: (_: any, { email }: { email: string }) => {
      return users.sendEmailPassword(email);
    },
    confirmPasswordReset: (
      _: any,
      { actionCode, newPassword }: { actionCode: string; newPassword: string },
    ) => {
      return users.confirmPasswordReset(actionCode, newPassword);
    },
    signOut: (_: any) => users.signOut(),
  },
};
