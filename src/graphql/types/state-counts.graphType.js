import { GraphQLObjectType, GraphQLString, GraphQLFloat } from "graphql";

const StateCountsInnerType = new GraphQLObjectType({
	name: "StateCounts",
	fields: {
		state: { type: GraphQLString },
		percentChange: { type: GraphQLFloat }
	}
});

const StateCountsResultsType = new GraphQLObjectType({
	name: "FastestGrowingStateForResults",
	fields: {
		results: {
			type: StateCountsInnerType,
			resolve: (args) => {
				const { state, pchange: percentChange } = args;
				return { state, percentChange };
			}
		}
	}
});

export default StateCountsResultsType;