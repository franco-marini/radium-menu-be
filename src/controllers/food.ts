import { ApolloError } from 'apollo-server-express';
import { firestore } from 'firebase-admin';

import { STATUS } from '../types/enums';
import { Validation } from '../types/enums/error-messages';
import { ICrateFood, IFood, IUpdateFood } from '../types/food';
import { database } from '../server';

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
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
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
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    await entry.set(updatedFood).catch(error => {
      throw new ApolloError(error);
    });
    return updatedFood;
  } else throw new ApolloError(Validation.notFound);
};

const deleteFood = async (id: string) => {
  const entry = database.collection('foods').doc(id);
  const currentData = (await entry.get()).data();
  if (currentData) {
    const deletedFood = {
      ...currentData,
      status: STATUS.DELETED,
      deleted: true,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    await entry.set(deletedFood).catch(error => {
      throw new ApolloError(error);
    });
    return deletedFood;
  } else throw new ApolloError(Validation.notFound);
};

export default {
  createFood,
  getAllFoods,
  getUsersFoods,
  updateFood,
  deleteFood,
};
