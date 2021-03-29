import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response, Router } from 'express';
import boom from 'express-boom';
import firebase from 'firebase';
import admin from 'firebase-admin';
import { GraphQLError } from 'graphql';
import { applyMiddleware } from 'graphql-middleware';
import { makeExecutableSchema } from 'graphql-tools';
import mongoose from 'mongoose';
dotenv.config();

import ExecutableSchema from './graphql';
import context from './graphql/context';
import permissions from './graphql/permissions';
import { firebaseConfig } from './helpers/firebaseConfig';

// Server and port initializations
const app = express();
const router = Router();
const port = process.env.PORT_BE || 4000;

const adminFirebaseConfig = {
  credential: admin.credential.cert({
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    projectId: process.env.FIREBASE_PROJECT_ID,
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};

export const fbAdmin = admin.initializeApp(adminFirebaseConfig);
export const fb = firebase.initializeApp(firebaseConfig);

const schema = makeExecutableSchema(ExecutableSchema);

const server: any = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context,
  formatError: (error: GraphQLError) => {
    return error;
  },
});

server.applyMiddleware({
  app: router,
});

app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());
app.use(boom());
app.use('/status', (req, res) => {
  res.send(`Healthy check ✅ \n`);
});

// Mongoose DB connection
if (process.env.ENVIRONMENT !== 'test') {
  mongoose
    .connect(`${process.env.DATABASE_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('DB connected ✅'))
    .catch((err) => console.log('Opps! Something went wrong ❌', err));
}

// Routes
app.use(router);

router.get('/', (req: Request, res: Response) => {
  res.send('Server running again! ✅ \n');
});

// Run server
if (process.env.ENVIRONMENT !== 'test') {
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/graphql ✅`);
  });
}

export default app;
