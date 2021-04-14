import { https } from 'firebase-functions';
import gqlServer from './server';

const api = https.onRequest(gqlServer);

export { api };
