import { gql } from 'apollo-server-express';

import { foodDefs, foodResolvers } from './food';
import { userDefs, userResolvers } from './user';

// Predefined types for the query due to this only needs to be one of this
const typeDefs = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

export default {
  typeDefs: [typeDefs, foodDefs, userDefs],
  resolvers: [foodResolvers, userResolvers],
};
