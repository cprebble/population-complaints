import { globalIdField } from "graphql-relay";
import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull } from "graphql";
import { nodeInterface } from "../node-def";
import ComplaintGraphType from "./complaint.graphType";


const resultsType = new GraphQLObjectType({
	name: "MostComplaintsByResults",
	fields: {
		results: {
			type: ComplaintGraphType,
			resolve: (arg) => arg
		}
	}
});

export default new GraphQLObjectType({
	name: "Viewer",
	description: "Entry point into the graph.",
	fields: () => {
		return {
			id: globalIdField(),
			mostComplaintsBy: {
				description: "Consumer complaints by company, product or state.",
				args: {
					returnArg: {type: new GraphQLNonNull(GraphQLString)},
					state: {type: new GraphQLNonNull(GraphQLString)}
				},
				type: new GraphQLList(resultsType),
				resolve: async (root, { returnArg, state }, { db }) => {
					const sqlString = addArgsToSelect(returnArg, state);
					console.log(sqlString); // eslint-disable-line no-console
					const query = await db.query(sqlString);
					return query.rows;
				}
			}
		};
	},
	interfaces: [nodeInterface],
});

const addArgsToSelect = (returnArg, byThisState) => `select ${returnArg}, count(${returnArg})
	as counts from complaints where state = '${byThisState}'
	group by ${returnArg} order by counts desc limit 100`;


/*
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
    mostComplaintsBy(returnArg: "company", state: "NY") {
      results {
        company
        counts
      }
    }
  }
}
*/