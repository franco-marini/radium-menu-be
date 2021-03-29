import { IUser } from '../../types/user';

export const parseUser = (doc: IUser) => ({
  username: doc.username,
  lastName: doc.lastName,
  firstName: doc.firstName,
  password: doc.password,
  isActive: doc.isActive,
  deleted: doc.deleted,
  createdAt: doc.createdAt,
});
