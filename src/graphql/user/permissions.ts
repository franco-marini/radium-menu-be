import { and, or } from 'graphql-shield';
import rules from '../rules';

export const permissionsUser = {
  Query: {
    user: and(rules.isAuthenticated, or(rules.roles.isAdmin)),
    users: and(rules.isAuthenticated, or(rules.roles.isAdmin)),
  },
  Mutation: {
    signIn: and(rules.auth.isValidPassword),
    signUp: and(rules.auth.isUniqueEmail),
    updateUser: and(rules.isAuthenticated, rules.auth.isUniqueEmail, or(rules.roles.isAdmin)),
    updatePasswordUser: and(rules.isAuthenticated, or(rules.roles.isAdmin)),
    deleteUser: and(rules.isAuthenticated, or(rules.roles.isAdmin)),
  },
};
