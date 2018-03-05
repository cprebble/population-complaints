import { globalIdField } from "graphql-relay";
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLNonNull,
	GraphQLInt,
	GraphQLFloat
} from "graphql";
import { nodeInterface } from "../node-def";
import ComplaintGraphType from "./complaint.graphType";

export default new GraphQLObjectType({
	name: "Viewer",
	description: "Entry point into the graph.",
	fields: () => {
		return {
			id: globalIdField(),
			mostComplaintsBy: {
				description: "Consumer complaints for company or product by state.",
				args: {
					returnArg: {type: new GraphQLNonNull(GraphQLString)},
					state: {type: new GraphQLNonNull(GraphQLString)}
				},
				type: new GraphQLList(complaintResultType),
				resolve: async (root, { returnArg, state }, { db }) => {
					const sqlString = addArgsToMostComplaintsBy(returnArg, state);
					console.log(sqlString); // eslint-disable-line no-console
					const query = await db.query(sqlString);
					return query.rows;
				}
			},
			fastestGrowingStateFor: {
				description: "Fastest growing state with most complaints for a company or product.",
				args: {
					byCompanyOrProduct: {type: new GraphQLNonNull(GraphQLString)},
					byCompanyOrProductValue: {type: new GraphQLNonNull(GraphQLString)}
				},
				type: new GraphQLList(stateCountsResultsType),
				resolve: async (root, { byCompanyOrProduct, byCompanyOrProductValue }, { db }) => {
					const sqlString = addArgsToFastestGrowingStateFor(byCompanyOrProduct, byCompanyOrProductValue);
					console.log(sqlString); // eslint-disable-line no-console
					const query = await db.query(sqlString);
					return query.rows;
				}
			}
		};
	},
	interfaces: [nodeInterface],
});

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

const complaintResultType = new GraphQLObjectType({
	name: "MostComplaintsByResults",
	fields: {
		results: {
			type: ComplaintGraphType,
			resolve: (arg) => arg
		}
	}
});

const addArgsToFastestGrowingStateFor = (byArg, byArgValue) => `select c.state, 
	round(cast(sum(p.change_percent)/count(c.state) as numeric), 2) as pchange 
	from complaints c
	inner join populations p on (c.state = p.state)
	where lower(c.${byArg}) like lower('${byArgValue}%')
	group by c.state order by pchange desc`;

const addArgsToMostComplaintsBy = (returnArg, byThisState) => `select ${returnArg}, count(${returnArg})
	as counts from complaints where state = '${byThisState}'
	group by ${returnArg} order by counts desc limit 100`;


/*
Example queries in graphiql:

mostComplaintsBy:
{
  viewer {
    id
    mostComplaintsBy(returnArg: "product", state: "NY") {
      results {
        product
        counts
      }
    }
  }
}

{
  viewer {
    id
    mostComplaintsBy(returnArg: "company", state: "CO") {
      results {
        company
        counts
      }
    }
  }
}

fastestGrowingStateFor:
{
  viewer {
    id
    fastestGrowingStateFor(byCompanyOrProduct: "company", byCompanyOrProductValue: "payday") {
      results {
        state
        percentChange
      }
    }
  }
}

{
  viewer {
    id
    fastestGrowingStateFor(byCompanyOrProduct: "product", byCompanyOrProductValue: "mortgage") {
      results {
        state
        percentChange
      }
    }
  }
}

*/