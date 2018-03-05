import { globalIdField } from "graphql-relay";
import { GraphQLObjectType, GraphQLString } from "graphql";
import { nodeInterface } from "../node-def";
import ComplaintGraphType from "./complaint.graphType";

export default new GraphQLObjectType({
	name: "Viewer",
	description: "Entry point into the graph.",
	fields: () => {
		return {
			id: globalIdField(),
			complaints: {
				description: "Consumer complaints by company, product or state.",
				args: {
					company: {type: GraphQLString},
					product: {type: GraphQLString},
					state: {type: GraphQLString}
				},
				type: ComplaintGraphType,
				resolve: async (root, args, ast) => {
					console.log("complaint resolver", root, args, ast);
					return { viewer: "complaints" };
				}
			}
		};
	},
	interfaces: [nodeInterface],
});