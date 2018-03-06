import { globalIdField } from "graphql-relay";
import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull } from "graphql";
import { nodeInterface } from "../node-def";
import StateCountsResultsType from "./state-counts.graphType";
import ComplaintsResultType from "./complaints-results.graphType";

// TODO: pagination
export default new GraphQLObjectType({
	name: "Viewer",
	description: "Entry point into the graph.",
	fields: () => {
		return {
			id: globalIdField(),
			mostComplaintsBy: {
				description: "Consumer complaints for company or product by state.",
				args: {
					returnCompanyOrProduct: {type: new GraphQLNonNull(GraphQLString)},
					state: {type: new GraphQLNonNull(GraphQLString)}
				},
				type: new GraphQLList(ComplaintsResultType),
				resolve: async (root, { returnCompanyOrProduct, state }, { db }) => {
					const sqlString = addArgsToMostComplaintsBy(returnCompanyOrProduct, state);
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
				type: new GraphQLList(StateCountsResultsType),
				resolve: async (root, { byCompanyOrProduct, byCompanyOrProductValue }, { db }) => {
					const sqlString = addArgsToFastestGrowingStateFor(byCompanyOrProduct, byCompanyOrProductValue);
					const query = await db.query(sqlString);
					return query.rows;
				}
			},
			populationChangeEachStateForComplaintsBy: {
				description: "Population change in each state where complaint was received for company or product.",
				args: {
					byCompanyOrProduct: {type: new GraphQLNonNull(GraphQLString)},
					byCompanyOrProductValue: {type: new GraphQLNonNull(GraphQLString)}
				},
				type: new GraphQLList(StateCountsResultsType),
				resolve: async (root, { byCompanyOrProduct, byCompanyOrProductValue }, { db }) => {
					const sqlString = addArgsToPopulationChangeEachStateForComplaintsBy(byCompanyOrProduct, byCompanyOrProductValue);
					const query = await db.query(sqlString);
					return query.rows;
				}
			}
		};
	},
	interfaces: [nodeInterface],
});


const addArgsToPopulationChangeEachStateForComplaintsBy = (byArg, byArgValue) => `
	select p.state, round(cast(sum(p.change_percent)/count(p.state) as numeric), 2) as pchange
	from populations p
	where p.state = any(select distinct state from complaints 
	where lower(${byArg}) like lower('${byArgValue}%'))
	group by p.state
	order by pchange desc
`;

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

populationChangeEachStateForComplaintsBy:
{
  viewer {
    id
    populationChangeEachStateForComplaintsBy(byCompanyOrProduct: "company", byCompanyOrProductValue: "Bank of America") {
      results {
        state
        percentChange
      }
    }
  }
}


*/