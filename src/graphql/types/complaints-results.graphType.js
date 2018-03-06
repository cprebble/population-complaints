import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";

const ComplaintsInnerType = new GraphQLObjectType({
	name: "ComplaintsInnerType",
	fields: {
		companyOrProduct: { type: GraphQLString },
		counts: { type: GraphQLInt }
	}
});

const ComplaintsResultType = new GraphQLObjectType({
	name: "MostComplaintsByResults",
	fields: {
		results: {
			type: ComplaintsInnerType,
			resolve: (args) => {
				const { company, product, counts } = args;
				const companyOrProduct = company || product;
				return { companyOrProduct, counts };
			}
		}
	}
});

export default ComplaintsResultType;