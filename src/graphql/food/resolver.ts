import foods from '../../controllers/food';
import { ICrateFood, IUpdateFood } from '../../types/food';

export const foodResolvers = {
  Query: {
    allFoods: async (_: unknown, { filter }: { filter: string }) => foods.getAllFoods(filter),
    usersFoods: async (_: unknown, { filter }: { filter: string }) => foods.getUsersFoods(filter),
  },
  Mutation: {
    createFood: async (_: unknown, { input }: { input: ICrateFood }) => foods.createFood(input),
    updateFood: async (_: unknown, { input }: { input: IUpdateFood }) => foods.updateFood(input),
    deleteFood: async (_: unknown, { id }: { id: string }) => foods.deleteFood(id),
  },
};
