
import expressGraphql from "express-graphql";
const graphqlSchema = require("../graphql/schema").default;

function getStackTraceFromError(err) {
	if (process.env.NODE_ENV === "development") {
		const stack = (err && err.stack) || "";
		return stack.split("\n");
	}
}

export default (app) => {
	const db = app.settings.db;
	return (req, res) => {
		expressGraphql({
			schema: graphqlSchema,
			context: { db },
			pretty: true,
			graphiql: true,
			formatError: (error) => {
				// eslint-disable-next-line no-console
				console.error(error);
				return {
					message: error.message,
					locations: error.locations,
					stack: getStackTraceFromError(error.originalError)
				};
			},
		})(req, res);
	};
};

