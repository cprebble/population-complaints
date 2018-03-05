import { globalIdField } from "graphql-relay";
import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLFloat } from "graphql";
import { nodeInterface } from "../node-def";

export default new GraphQLObjectType({
	name: "Population",
	description: "Changes in population of cities and states in USA.",
	fields: () => ({
		id: globalIdField(),
		city: {
			description: "Company complained against.",
			type: GraphQLString
		},
		state: {
			description: "The product about being complained.",
			type: GraphQLString
		},
		changeByNumber: {
			description: "The complaint.",
			type: GraphQLInt
		},
		changeByPercent: {
			description: "The complaint.",
			type: GraphQLFloat
		},
	}),
	interfaces: [nodeInterface],
});