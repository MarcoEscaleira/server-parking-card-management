import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import graphqlHTTP from "express-graphql";
import cors from "cors";
import { CardResolver } from "./resolvers/CardResolver";
import { CheckInResolver } from "./resolvers/CheckInResolver";
import { ScheduleTodayNight, ScheduleTodayMorning } from "./schedules";

(async () => {
	const app = express();

	const port = process.env.PORT || 4000;

	const corsWhitelist = ["http://localhost:3000", `http://localhost:${port}`];
	app.use(
		cors({
			origin: (origin, callback) => {
				if (corsWhitelist.indexOf(origin as string) !== -1 || !origin) {
					callback(null, true);
				} else {
					callback(new Error("Not allowed by CORS"));
				}
			}
		})
	);

	const options = await getConnectionOptions(process.env.NODE_ENV || "development");
	await createConnection({ ...options, name: "default" });

	const graphqlSchema = await buildSchema({
		resolvers: [CardResolver, CheckInResolver],
		validate: true
	});

	const apolloServer = new ApolloServer({
		schema: graphqlSchema,
		context: ({ req, res }) => ({ req, res })
	});

	apolloServer.applyMiddleware({ app, cors: false });

	app.use(
		"/api",
		graphqlHTTP({
			schema: graphqlSchema,
			graphiql: true
		})
	);

	app.listen(port, () => {
		console.log(`Server started at http://localhost:${port}/graphql`);
		console.log(`Server started at http://localhost:${port}/api -> For HTTP Requests`);
	});

	ScheduleTodayNight(); // Schedule that checks if user has check ins open and alerts about checking out
	ScheduleTodayMorning(); // Schedule that checks if user has check ins open and complete user checkout
})();
