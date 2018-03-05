import { GraphQLObjectType, GraphQLNonNull } from "graphql";
import { ViewerGraphType } from "../types";

export default new GraphQLObjectType({
	name: "ROOTQUERY",
	fields: () => {
		return {
			viewer: {
				type: new GraphQLNonNull(ViewerGraphType),
				description: "query on Viewer.",
				resolve: () => ({})
			}
		};
	}
});
