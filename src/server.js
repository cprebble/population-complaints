
import express from "express";
import bodyParser from "body-parser";
import errorhandler from "errorhandler";
import { Client } from "pg";
import { graphqlRoute } from "./routes";

// TODO: README
// TODO: fix build steps for production

// TODO: add logger, ORM, ETL or Stream for data
// TODO: move these to .env
const PGHOST="postgres";
const PGUSER="postgres";
const PGDATABASE="consumers";
const PGPASSWORD="Password1!";
const PGPORT=5432;
const PORT = 3333;

// init db and wait for ok
const connectToDb = async () => {
	try {
		const client = new Client({
			user: PGUSER,
			host: PGHOST,
			database: PGDATABASE,
			password: PGPASSWORD,
			port: PGPORT
		});
		await client.connect();
		return client;
	} catch(e) {
		// eslint-disable-next-line no-console
		console.log("Error connecting to PG Client", e);
		throw e;
	}
};

let db;
const init = async () => {
	// eslint-disable-next-line no-console
	console.log("Starting Population Complaints API"); 

	const app = express();
	app.get("/health", (req, res) => {
		res.status(200).json({ status: "Ok" });
	});

	app.use(bodyParser.json());

	db = await connectToDb();
	app.settings.db = db;

	app.use("/graphql", graphqlRoute(app));

	app.use(errorhandler({ dumpExceptions: true, showStack: true }));

	return app;
};

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
		exitHandler(err);
	}
})();

const exitHandler = async function(err) {
	// eslint-disable-next-line no-console
	if (err) console.log("exitHandler err: " + err.stack);
	if (db) {
		await db.end();
	}
	process.exit();
};

//do something when app is closing
process.on("exit", function() {
	exitHandler();
});

//catches ctrl+c event
process.on("SIGINT", function() {
	exitHandler();
});

process.on("SIGTERM",function(){
	exitHandler();
});

//catches uncaught exceptions
process.on("uncaughtException", function(err) {
	exitHandler(err);
});