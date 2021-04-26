import { and, or } from 'graphql-shield';
import rules from '../rules';

export const permissionsFood = {
  Query: {
    allFoods: and(rules.isAuthenticated, or(rules.roles.isChef)),
    usersFoods: and(rules.isAuthenticated, or(rules.roles.isUser, rules.roles.isChef)),
  },
  Mutation: {
    createFood: and(rules.isAuthenticated, or(rules.roles.isChef)),
    updateFood: and(rules.isAuthenticated, or(rules.roles.isChef)),
    deleteFood: and(rules.isAuthenticated, or(rules.roles.isChef)),
  },
};
