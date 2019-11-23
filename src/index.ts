import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from "cors";
import { CardResolver } from "./resolvers/CardResolver";
import { CheckInResolver } from "./resolvers/CheckInResolver";
import { ScheduleTodayNight, ScheduleTodayMorning }  from "./schedules";

(async () => {
  const app = express();
  
  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
  }));

  const options = await getConnectionOptions(
    process.env.NODE_ENV || "development"
  );
  await createConnection({ ...options, name: "default" });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [CardResolver, CheckInResolver],
      validate: true
    }),
    context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app, cors: false });
  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}/graphql`);
  });
  
  ScheduleTodayNight(); // Schedule that checks if user has check ins open and alerts about checking out
  ScheduleTodayMorning(); // Schedule that checks if user has check ins open and complete user checkout
})();
