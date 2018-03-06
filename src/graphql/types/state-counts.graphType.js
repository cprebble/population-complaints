import { GraphQLObjectType, GraphQLString, GraphQLFloat } from "graphql";

const stateCountsInnerType = new GraphQLObjectType({
	name: "StateCounts",
	fields: {
		state: { type: GraphQLString },
		percentChange: { type: GraphQLFloat }
	}
});

const stateCountsResultsType = new GraphQLObjectType({
	name: "FastestGrowingStateForResults",
	fields: {
		results: {
			type: stateCountsInnerType,
			resolve: (args) => {
				const { state, pchange: percentChange } = args;
				return { state, percentChange };
			}
		}
	}
});

export default stateCountsResultsType;