import foods from '../../controllers/food';
import { ICrateFood, IUpdateFood } from '../../types/food';

export const foodResolvers = {
  Query: {
    allFoods: async (_: any, { filter }: { filter: string }) =>
      foods.getAllFoods(filter),
    usersFoods: async (_: any, { filter }: { filter: string }) =>
      foods.getUsersFoods(filter),
  },
  Mutation: {
    createFood: async (_: any, { input }: { input: ICrateFood }) =>
      foods.createFood(input),
    updateFood: async (_: any, { input }: { input: IUpdateFood }) =>
      foods.updateFood(input),
    deleteFood: async (_: any, { id }: { id: string }) => foods.deleteFood(id),
  },
};
