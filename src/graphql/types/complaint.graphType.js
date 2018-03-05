import { globalIdField } from "graphql-relay";
import { GraphQLObjectType, GraphQLString } from "graphql";
import { nodeInterface } from "../node-def";

export default new GraphQLObjectType({
	name: "Complaint",
	description: "Consumer complaints about companies.",
	fields: () => ({
		id: globalIdField(),
		company: {
			description: "Company complained against.",
			type: GraphQLString,
		},
		product: {
			description: "The product about being complained.",
			type: GraphQLString,
		},
		complaint: {
			description: "The complaint.",
			type: GraphQLString,
		},
		response: {
			description: "The company's response to the complaint.",
			type: GraphQLString,
		},
		date: {
			description: "The date of the complaint.",
			type: GraphQLString
		},
		state: {
			description: "The state of the complaining consumer.",
			type: GraphQLString
		}
	}),
	interfaces: [nodeInterface],
});