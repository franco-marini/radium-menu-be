import { STATUS } from '../types/enums';
import { Validation } from '../types/enums/error-messages';
import { ICrateFood, IFood, IUpdateFood } from '../types/food';
import { database } from '../';

const getUsersFoods = async (filter = '') => {
  const allFoods: IFood[] = [];
  const foodsRef = database.collection('foods');
  const queryRef = await foodsRef.where('status', '!=', STATUS.DELETED).get();
  queryRef.forEach((doc: any) => allFoods.push(doc.data()));
  if (filter !== '') {
    const filteredFood = allFoods.filter(food =>
      food.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()),
    );
    return filteredFood;
  }
  return allFoods;
};

const getAllFoods = async (filter = '') => {
  const allFoods: IFood[] = [];
  const foodsRef = database.collection('foods');
  const queryRef = await foodsRef.where('status', '!=', STATUS.DELETED).get();
  queryRef.forEach((doc: any) => allFoods.push(doc.data()));
  if (filter !== '') {
    const filteredFood = allFoods.filter(food =>
      food.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()),
    );
    return filteredFood;
  }
  return allFoods;
};

const createFood = async ({ name, description, price }: ICrateFood) => {
  const entry = database.collection('foods').doc();
  const newFood = {
    id: entry.id,
    name,
    description,
    price,
    status: STATUS.ACTIVE,
    deleted: false,
  };

  entry.set(newFood);
  return newFood;
};

const updateFood = async ({ id, name, description, price, status }: IUpdateFood) => {
  const entry = database.collection('foods').doc(id);
  const currentData = (await entry.get()).data();
  if (currentData) {
    const updatedFood = {
      ...currentData,
      name: name || currentData.name,
      description: description || currentData.description,
      price: price || currentData.price,
      status: status || currentData.status,
    };

    await entry.set(updatedFood).catch(error => {
      throw new Error(error);
    });
    return updatedFood;
  } else throw new Error(Validation.notFound);
};

const deleteFood = async (id: string) => {
  const entry = database.collection('foods').doc(id);
  const currentData = (await entry.get()).data();
  if (currentData) {
    const deletedFood = {
      ...currentData,
      status: STATUS.DELETED,
      deleted: true,
    };

    await entry.set(deletedFood).catch(error => {
      throw new Error(error);
    });
    return deletedFood;
  } else throw new Error(Validation.notFound);
};

export default {
  createFood,
  getAllFoods,
  getUsersFoods,
  updateFood,
  deleteFood,
};
