import { gql } from 'apollo-server-express';

export const userDefs = gql`
  scalar Date

  enum Roles {
    ADMIN
    CHEF
    USER
  }

  type User {
    id: String!
    username: String!
    email: String
    firstName: String!
    lastName: String!
    password: String!
    isActive: Boolean!
    deleted: Boolean!
    role: Roles!
    createdAt: Date!
    updatedAt: Date!
  }

  type VerifyUserToken {
    username: String!
    token: String!
  }

  type SendEmailPassword {
    email: Boolean!
  }

  type ConfirmPasswordReset {
    response: Boolean
  }

  type SignOut {
    response: Boolean
  }

  type Auth {
    username: String
    userToken: String
    userRole: Roles
  }

  input UserInput {
    username: String!
    email: String!
    firstName: String!
    lastName: String!
    password: String!
    role: Roles!
  }

  input UpdateUserInput {
    id: ID!
    username: String!
    email: String!
    firstName: String!
    lastName: String!
    isActive: Boolean!
    role: Roles!
  }

  input UpdatePasswordUserInput {
    id: ID!
    password: String!
  }

  type UserPage {
    id: String!
    username: String!
    email: String
    firstName: String!
    lastName: String!
    password: String!
    isActive: Boolean!
    deleted: Boolean!
    role: Roles!
    createdAt: Date!
  }

  extend type Query {
    user(id: ID!): User
    users(filter: String): [UserPage]
    checkForeignToken: VerifyUserToken
  }

  extend type Mutation {
    signUp(input: UserInput): User
    signIn(username: String, password: String): Auth
    updateUser(input: UpdateUserInput): User
    updatePasswordUser(input: UpdatePasswordUserInput): User
    deleteUser(id: ID!): User
    sendEmailPassword(email: String!): SendEmailPassword
    confirmPasswordReset(actionCode: String!, newPassword: String!): ConfirmPasswordReset
    signOut: SignOut
  }
`;
