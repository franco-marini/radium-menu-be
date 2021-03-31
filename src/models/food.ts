import { model, Schema } from 'mongoose';

import { STATUS } from '../types/enums';
import { IFood } from '../types/food';

const FoodSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: STATUS.ACTIVE,
  },
  price: {
    type: Number,
    required: true,
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default model<IFood>('Food', FoodSchema);
