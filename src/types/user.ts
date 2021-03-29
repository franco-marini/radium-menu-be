import { Document } from 'mongoose';

import { ROLES } from '../types/enums';

export interface IUser extends Document {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: ROLES;
  isActive: boolean;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISignUpUserInput {
  input: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    role: ROLES;
  };
}

export interface IUpdateUserInput {
  input: {
    id: string;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    role: ROLES;
  };
}
