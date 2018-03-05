import express from "express";
import bodyParser from "body-parser";
import errorhandler from "errorhandler";
import { graphqlRoute } from "./routes";

// TODO: add logger, ORM, ETL or Stream for data
// TODO: tests, UI

// init db and wait for ok
const connectToDb = () => {

};

const init = async () => {
	// eslint-disable-next-line no-console
	console.log("Starting Population Complaints API"); 

	const app = express();
	app.get("/health", (req, res) => {
		res.status(200).json({ status: "Ok" });
	});

	app.use(bodyParser.json());

	const db = await connectToDb();
	app.settings.db = db;

	app.use("/graphql", graphqlRoute(app));

	app.use(errorhandler({ dumpExceptions: true, showStack: true }));

	return app;
};

const PORT = 3333;
const start = async () => {
	const app = await init();

	app.listen(PORT, () => {
		// eslint-disable-next-line no-console
		console.log(`Express server listening on port ${PORT}`);
	});
};

(async () => {
	try {
		await start();
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(`An error occurred ${err}`);
		process.exit(); // eslint-disable-line
	}
})();