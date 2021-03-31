import users from '../../controllers/user';
import { ISignUpUserInput, IUpdateUserInput } from '../../types/user';

export const userResolvers = {
  Query: {
    user: (_: unknown, { id }: { id: string }) => users.getUser(id),
    users: async (_: unknown, { filter }: { filter: string }) => users.getUsers(filter),
    checkForeignToken: (_: unknown) => users.getUserByToken(),
  },
  Mutation: {
    signUp: (
      _: unknown,
      { input: { username, email, firstName, lastName, password, role } }: ISignUpUserInput,
    ) => users.signUp(username, email, firstName, lastName, password, role),
    signIn: (_: unknown, { username, password }: { username: string; password: string }) =>
      users.signIn(username, password),
    updateUser: (
      _: unknown,
      { input: { id, username, email, firstName, lastName, isActive, role } }: IUpdateUserInput,
    ) => users.updateUser(id, username, email, firstName, lastName, isActive, role),
    updatePasswordUser: (_: unknown, { input: { id, password } }: IUpdateUserInput) =>
      users.updatePasswordUser(id, password),
    deleteUser: (_: unknown, { id }: { id: string }) => users.deleteUser(id),
    sendEmailPassword: (_: unknown, { email }: { email: string }) => users.sendEmailPassword(email),
    confirmPasswordReset: (
      _: unknown,
      { actionCode, newPassword }: { actionCode: string; newPassword: string },
    ) => users.confirmPasswordReset(actionCode, newPassword),
    signOut: (_: unknown) => users.signOut(),
  },
};
