import { nodeDefinitions, fromGlobalId } from "graphql-relay";
import ViewerGraphType from "./types";
import db from "../db";

// TODO: abstract out ViewerGraphType and db.getViewer from here

const getObjectFromGlobalId = async (globalId) => {
	const { type } = fromGlobalId(globalId);
	if (type === "Viewer") {
		return db.getViewer();
	}
	
	return null;
};

const getTypeFromObject = (obj) => {
	if (obj instanceof ViewerGraphType) {
		return ViewerGraphType;
	} else {
		return null;
	}
};

export const { nodeInterface, nodeField } = nodeDefinitions(getObjectFromGlobalId, getTypeFromObject);

