import { AuthenticationError } from 'apollo-server-express';
import { Request } from 'express';

import * as Errors from '../types/enums/error-messages';
import { IUser } from '../types/user';
import { fbAdmin, database } from '../server';

interface ContextParam extends Request {
  req: Request;
}

export interface ContextResponse {
  user: IUser | null;
}

const context = async ({ req }: ContextParam): Promise<ContextResponse> => {
  try {
    const authToken = req.headers.authorization;

    if (!authToken) {
      return { user: null };
    }

    const decodedToken = await fbAdmin.auth().verifyIdToken(authToken);

    if (!decodedToken) {
      throw new AuthenticationError(Errors.AuthErrors.failed);
    }

    const usersRef = database.collection('users').doc(decodedToken.uid);
    const doc = await usersRef.get();
    const userRole: any = doc.data();

    return {
      user: userRole,
    };
  } catch (error) {
    throw new AuthenticationError('invalid token');
  }
};

export default context;
