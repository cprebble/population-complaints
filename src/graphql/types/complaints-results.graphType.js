import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";

const complaintsInnerType = new GraphQLObjectType({
	name: "ComplaintsInnerType",
	fields: {
		companyOrProduct: { type: GraphQLString },
		counts: { type: GraphQLInt }
	}
});

const complaintsResultType = new GraphQLObjectType({
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

export default complaintsResultType;