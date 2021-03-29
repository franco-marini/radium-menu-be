import { rule } from 'graphql-shield';

import { ContextResponse } from '../context';
import auth from './auth';
import roles from './roles';

const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, ctx: ContextResponse, info) => !!ctx.user,
);

export default {
  isAuthenticated,
  roles,
  auth,
};
