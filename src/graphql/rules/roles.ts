import { rule } from 'graphql-shield';

import { ROLES } from '../../types/enums';
import { ContextResponse } from '../context';

const isAdmin = rule({ cache: 'contextual' })(
  async (parent, args, ctx: ContextResponse, info) =>
    ctx.user.role === ROLES.ADMIN,
);

const isChef = rule({ cache: 'contextual' })(
  async (parent, args, ctx: ContextResponse, info) =>
    ctx.user.role === ROLES.CHEF,
);

const isUser = rule({ cache: 'contextual' })(
  async (parent, args, ctx: ContextResponse, info) =>
    ctx.user.role === ROLES.USER,
);

export default {
  isAdmin,
  isChef,
  isUser,
};
