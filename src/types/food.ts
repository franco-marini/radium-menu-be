import { Document } from 'mongoose';

import { STATUS } from './enums';

export interface IFood extends Document {
  name: string;
  description: string;
  status: STATUS;
  price: number;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICrateFood {
  name: string;
  description: string;
  price: number;
}

export interface IUpdateFood {
  id: string;
  name: string;
  description: string;
  price: number;
  status: STATUS;
}
