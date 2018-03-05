import { globalIdField } from "graphql-relay";
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLNonNull,
	GraphQLFloat,
	GraphQLInt
} from "graphql";
import { nodeInterface } from "../node-def";

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
				type: new GraphQLList(complaintResultType),
				resolve: async (root, { returnCompanyOrProduct, state }, { db }) => {
					const sqlString = addArgsToMostComplaintsBy(returnCompanyOrProduct, state);
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
			},
			populationChangeEachStateForComplaintsBy: {
				description: "Population change in each state where complaint was received for company or product.",
				args: {
					byCompanyOrProduct: {type: new GraphQLNonNull(GraphQLString)},
					byCompanyOrProductValue: {type: new GraphQLNonNull(GraphQLString)}
				},
				type: new GraphQLList(stateCountsResultsType),
				resolve: async (root, { byCompanyOrProduct, byCompanyOrProductValue }, { db }) => {
					const sqlString = addArgsToPopulationChangeEachStateForComplaintsBy(byCompanyOrProduct, byCompanyOrProductValue);
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

const complaintsInnerType = new GraphQLObjectType({
	name: "ComplaintsInnerType",
	fields: {
		companyOrProduct: { type: GraphQLString },
		counts: { type: GraphQLInt }
	}
});

const complaintResultType = new GraphQLObjectType({
	name: "MostComplaintsByResults",
	fields: {
		results: {
			type: complaintsInnerType,
			resolve: (args) => {
				const { company, product, counts } = args;
				const companyOrProduct = company || product;
				return { companyOrProduct, counts };
			}
		}
	}
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