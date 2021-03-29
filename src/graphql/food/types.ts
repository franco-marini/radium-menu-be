import { gql } from 'apollo-server-express';

export const foodDefs = gql`
  type Food {
    id: ID
    name: String
    description: String
    status: String
    price: Float
    deleted: Boolean
  }

  input FoodInputCreate {
    name: String!
    description: String!
    price: Float!
  }

  input FoodInputUpdate {
    id: ID!
    name: String!
    description: String!
    status: String!
    price: Float!
  }

  extend type Query {
    allFoods(filter: String): [Food]
    usersFoods(filter: String): [Food]
  }

  extend type Mutation {
    createFood(input: FoodInputCreate!): Food
    updateFood(input: FoodInputUpdate!): Food
    deleteFood(id: String!): Food
  }
`;
