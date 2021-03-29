import { shield } from 'graphql-shield';

import { permissionsFood } from './food/permissions';
import { permissionsUser } from './user/permissions';

export default shield(
  {
    Query: {
      ...permissionsFood.Query,
      ...permissionsUser.Query,
    },
    Mutation: {
      ...permissionsFood.Mutation,
      ...permissionsUser.Mutation,
    },
  },
  { allowExternalErrors: true },
);
