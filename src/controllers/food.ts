import Food from '../models/food';
import { STATUS } from '../types/enums';
import { ICrateFood, IUpdateFood } from '../types/food';

const getUsersFoods = async (filter = '') =>
  Food.find({
    $and: [
      {
        $or: [{ name: { $regex: filter, $options: 'i' } }],
      },
      {
        status: STATUS.ACTIVE,
        deleted: false,
      },
    ],
  });

const getAllFoods = async (filter = '') =>
  Food.find({
    $and: [
      {
        $or: [{ name: { $regex: filter, $options: 'i' } }],
      },
      {
        deleted: false,
      },
    ],
  });

const createFood = async ({ name, description, price }: ICrateFood) => {
  const NewFood = new Food({
    name,
    description,
    price,
  });
  const savedFood = await NewFood.save();
  return savedFood;
};

const updateFood = async ({ id, name, description, price, status }: IUpdateFood) =>
  Food.findOneAndUpdate(
    { _id: id },
    {
      name,
      description,
      price,
      status,
    },
    { new: true },
  );

const deleteFood = async (id: string) =>
  Food.findOneAndUpdate(
    {
      _id: id,
      deleted: false,
    },
    {
      status: STATUS.DELETED,
      deleted: true,
    },
    { new: true },
  );

export default {
  createFood,
  getAllFoods,
  getUsersFoods,
  updateFood,
  deleteFood,
};
